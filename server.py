import os
import sys
import json
import sqlite3
import subprocess
import threading
import glob
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

PORT = 8000
DB_FILE = os.path.join("output", "gsid_harvest.db")
LOG_FILE = os.path.join("output", "server_run.log")

active_process = None
active_process_lock = threading.Lock()

def init_db():
    """Ensure output folder and database table exist."""
    os.makedirs("output", exist_ok=True)
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS harvested_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            display_name TEXT NOT NULL,
            email TEXT,
            institution_name TEXT,
            institution_country TEXT,
            openalex_id TEXT,
            source TEXT NOT NULL,
            article_title TEXT,
            article_url TEXT,
            specialisation TEXT,
            keywords TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(display_name, email, source, article_title)
        )
    """)
    conn.commit()
    conn.close()

class GSIDConsoleHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for file:// scheme testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path == "/api/status":
            self.get_status()
        elif path == "/api/records":
            self.get_records()
        elif path == "/api/run-status":
            self.get_run_status()
        elif path == "/api/synthesized":
            self.get_synthesized()
        else:
            # Fallback to default static file server
            super().do_GET()

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        # Read POST body
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b""

        if path == "/api/upload-csv":
            self.upload_csv(post_data)
            return

        body = {}
        if post_data:
            try:
                body = json.loads(post_data.decode('utf-8'))
            except Exception:
                pass

        if path == "/api/update-record":
            self.update_record(body)
        elif path == "/api/run-script":
            self.run_script(body)
        elif path == "/api/kill-script":
            self.kill_script()
        else:
            self.send_response(404)
            self.end_headers()

    def send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def get_status(self):
        db_exists = os.path.exists(DB_FILE)
        count = 0
        if db_exists:
            try:
                conn = sqlite3.connect(DB_FILE)
                c = conn.cursor()
                c.execute("SELECT count(*) FROM harvested_records")
                count = c.fetchone()[0]
                conn.close()
            except Exception:
                pass

        global active_process
        running = False
        with active_process_lock:
            if active_process and active_process.poll() is None:
                running = True

        self.send_json(200, {
            "db_exists": db_exists,
            "records_count": count,
            "api_server_running": True,
            "script_running": running
        })

    def get_records(self):
        if not os.path.exists(DB_FILE):
            self.send_json(200, [])
            return
        
        try:
            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            c = conn.cursor()
            c.execute("SELECT * FROM harvested_records ORDER BY id DESC LIMIT 500")
            rows = c.fetchall()
            conn.close()

            records = [dict(r) for r in rows]
            self.send_json(200, records)
        except Exception as e:
            self.send_json(500, {"error": str(e)})

    def update_record(self):
        pass  # Will implement below, need body parameter

    def update_record(self, body):
        rec_id = body.get("id")
        if not rec_id:
            self.send_json(400, {"error": "Missing record ID"})
            return

        try:
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute("""
                UPDATE harvested_records 
                SET display_name = ?, email = ?, institution_name = ?, institution_country = ?, 
                    openalex_id = ?, article_title = ?, article_url = ?, specialisation = ?, keywords = ?, source = ?
                WHERE id = ?
            """, (
                body.get("display_name", ""),
                body.get("email", ""),
                body.get("institution_name", ""),
                body.get("institution_country", ""),
                body.get("openalex_id", ""),
                body.get("article_title", ""),
                body.get("article_url", ""),
                body.get("specialisation", ""),
                body.get("keywords", ""),
                body.get("source", "API"),
                rec_id
            ))
            conn.commit()
            conn.close()
            self.send_json(200, {"success": True})
        except Exception as e:
            self.send_json(500, {"error": str(e)})

    def run_script(self, body):
        script = body.get("script")
        args = body.get("args", [])

        script_mapping = {
            "agent1": "agent1_api_harvester.py",
            "agent2": "agent2_ethical_scraper.py",
            "agent3": "agent3_data_synthesizer.py",
            "gsid_scraper": "gsid_faculty_scraper.py"
        }

        script_file = script_mapping.get(script)
        if not script_file or not os.path.exists(script_file):
            self.send_json(400, {"error": "Invalid or missing script file"})
            return

        global active_process
        with active_process_lock:
            if active_process and active_process.poll() is None:
                self.send_json(400, {"error": "Another script is already running"})
                return

            os.makedirs("output", exist_ok=True)
            # Empty old log file
            with open(LOG_FILE, "w", encoding="utf-8") as f:
                f.write(f"--- Launching {script_file} with args {args} ---\n")

            # Compile subprocess arguments
            cmd = [sys.executable, script_file] + args
            try:
                log_fd = open(LOG_FILE, "a", encoding="utf-8")
                active_process = subprocess.Popen(
                    cmd,
                    stdout=log_fd,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1
                )
                self.send_json(200, {"success": True, "pid": active_process.pid})
            except Exception as e:
                self.send_json(500, {"error": str(e)})

    def get_run_status(self):
        global active_process
        running = False
        exit_code = None

        with active_process_lock:
            if active_process:
                exit_code = active_process.poll()
                running = (exit_code is None)

        logs = ""
        if os.path.exists(LOG_FILE):
            try:
                with open(LOG_FILE, "r", encoding="utf-8", errors="replace") as f:
                    logs = f.read()
            except Exception:
                pass

        self.send_json(200, {
            "running": running,
            "exit_code": exit_code,
            "logs": logs
        })

    def kill_script(self):
        global active_process
        with active_process_lock:
            if active_process and active_process.poll() is None:
                try:
                    active_process.terminate()
                    active_process.wait(timeout=3)
                    self.send_json(200, {"success": True})
                except Exception as e:
                    self.send_json(500, {"error": str(e)})
            else:
                self.send_json(200, {"message": "No process running"})

    def upload_csv(self, post_data):
        try:
            csv_text = post_data.decode('utf-8')
            lines = csv_text.split('\n')
            if len(lines) < 2:
                self.send_json(400, {"error": "Invalid empty CSV"})
                return

            import csv as csv_parser
            import io
            f = io.StringIO(csv_text.strip())
            reader = csv_parser.reader(f)
            headers = next(reader)
            headers = [h.strip().lower() for h in headers]

            # Mappings
            name_idx = next((i for i, h in enumerate(headers) if "name" in h), -1)
            email_idx = next((i for i, h in enumerate(headers) if "email" in h), -1)
            inst_idx = next((i for i, h in enumerate(headers) if "institution" in h or "affiliation" in h), -1)
            country_idx = next((i for i, h in enumerate(headers) if "country" in h or "region" in h), -1)
            spec_idx = next((i for i, h in enumerate(headers) if "specialis" in h or "discipline" in h or "keyword" in h), -1)
            source_idx = next((i for i, h in enumerate(headers) if "source" in h), -1)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            inserted_count = 0

            for cols in reader:
                if len(cols) < len(headers):
                    continue
                display_name = cols[name_idx] if name_idx != -1 else "Unknown"
                email = cols[email_idx] if email_idx != -1 else ""
                institution = cols[inst_idx] if inst_idx != -1 else ""
                country = cols[country_idx] if country_idx != -1 else ""
                spec = cols[spec_idx] if spec_idx != -1 else ""
                source = cols[source_idx] if source_idx != -1 else "CSV Import"

                try:
                    cursor.execute("""
                        INSERT OR IGNORE INTO harvested_records 
                        (display_name, email, institution_name, institution_country, source, specialisation)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (display_name, email, institution, country, source, spec))
                    if cursor.rowcount > 0:
                        inserted_count += 1
                except Exception:
                    pass

            conn.commit()
            conn.close()
            self.send_json(200, {"success": True, "count": inserted_count})
        except Exception as e:
            self.send_json(500, {"error": str(e)})

    def get_synthesized(self):
        # Look for clean csv in output/ or synthesized database
        # Find latest gsid_export_*.csv
        csv_files = glob.glob(os.path.join("output", "gsid_export_*.csv"))
        if not csv_files:
            # Fallback to standard clean directory query from database
            if not os.path.exists(DB_FILE):
                self.send_json(200, [])
                return
            try:
                conn = sqlite3.connect(DB_FILE)
                conn.row_factory = sqlite3.Row
                c = conn.cursor()
                # Simulate synthesis query: deduplicate on email, format
                c.execute("""
                    SELECT id, display_name as name, email, institution_name as affiliation, 
                           institution_country as country, specialisation as discipline, source as sourceName
                    FROM harvested_records 
                    GROUP BY coalesce(nullif(email, ''), display_name)
                    ORDER BY id DESC
                """)
                rows = c.fetchall()
                conn.close()
                self.send_json(200, [dict(r) for r in rows])
            except Exception as e:
                self.send_json(500, {"error": str(e)})
            return

        # Read latest CSV file
        latest_file = max(csv_files, key=os.path.getctime)
        try:
            import csv as csv_parser
            records = []
            with open(latest_file, "r", encoding="utf-8", errors="replace") as f:
                reader = csv_parser.DictReader(f)
                for r in reader:
                    records.append({
                        "name": r.get("Name", r.get("name", "")),
                        "email": r.get("Email", r.get("email", "")),
                        "affiliation": r.get("Institution", r.get("institution", "")),
                        "country": r.get("Region", r.get("region", "")),
                        "discipline": r.get("Specialisation", r.get("specialisation", "")),
                        "sourceName": r.get("Source", r.get("source", "")),
                        "sourceType": "api" if r.get("Source", "") not in ["AJOL", "NJOL"] else "scrape"
                    })
            self.send_json(200, records)
        except Exception as e:
            self.send_json(500, {"error": str(e)})

if __name__ == "__main__":
    init_db()
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, GSIDConsoleHandler)
    print(f"GSID Console Server running on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
        if active_process and active_process.poll() is None:
            active_process.terminate()
        sys.exit(0)

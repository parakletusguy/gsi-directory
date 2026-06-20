"""
=============================================================================
Agent 1: The API Harvester (Scale Edition)
Global South Index Directory (GSID)
=============================================================================

Queries OpenAlex, DOAJ, and Zenodo APIs for researchers/papers affiliated
with institutions in Africa, Latin America, and Asia.
Saves results incrementally in a SQLite database to prevent data loss.

Usage:
    python agent1_api_harvester.py --regions africa,asia --sources openalex,doaj --limit 100
=============================================================================
"""

import argparse
import csv
import os
import sqlite3
import sys
import time
import logging
from datetime import datetime
from typing import Optional

import requests
from countries import get_countries_by_regions, COUNTRY_NAMES

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("agent1")

# Configure stdout for UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Database Setup
DB_FILE = os.path.join("output", "gsid_harvest.db")

def init_db():
    """Initializes the SQLite database for incremental storage."""
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
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
    # Migration: add columns if they don't exist yet
    try:
        cursor.execute("ALTER TABLE harvested_records ADD COLUMN specialisation TEXT")
    except sqlite3.OperationalError:
        pass
    try:
        cursor.execute("ALTER TABLE harvested_records ADD COLUMN keywords TEXT")
    except sqlite3.OperationalError:
        pass
    conn.commit()
    conn.close()

def save_record(record: dict) -> bool:
    """Saves a single record to SQLite. Returns True if inserted, False if duplicate."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO harvested_records 
            (display_name, email, institution_name, institution_country, openalex_id, source, article_title, article_url, specialisation, keywords)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(display_name, email, source, article_title) DO UPDATE SET
                institution_name = coalesce(nullif(excluded.institution_name, ''), institution_name),
                institution_country = coalesce(nullif(excluded.institution_country, ''), institution_country),
                openalex_id = coalesce(nullif(excluded.openalex_id, ''), openalex_id),
                article_url = coalesce(nullif(excluded.article_url, ''), article_url),
                specialisation = coalesce(nullif(excluded.specialisation, ''), specialisation),
                keywords = coalesce(nullif(excluded.keywords, ''), keywords)
        """, (
            record.get("display_name"),
            record.get("email", ""),
            record.get("institution_name", ""),
            record.get("institution_country", ""),
            record.get("openalex_id", ""),
            record.get("source"),
            record.get("article_title", ""),
            record.get("article_url", ""),
            record.get("specialisation", ""),
            record.get("keywords", "")
        ))
        inserted = cursor.rowcount > 0
        conn.commit()
        return inserted
    except sqlite3.Error as e:
        logger.error("DB Error: %s", e)
        return False
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# OpenAlex Harvester
# ---------------------------------------------------------------------------
class OpenAlexHarvester:
    URL = "https://api.openalex.org/works"
    MAILTO = "gsid-harvester@example.com"
    MAX_RETRIES = 3

    def __init__(self, country_codes: list[str], limit_per_country: int):
        self.country_codes = country_codes
        self.limit_per_country = limit_per_country

    def harvest(self):
        logger.info("Starting OpenAlex Harvester for %d countries...", len(self.country_codes))
        # OpenAlex allows OR filtering on country_code: NG|BR|...
        # We process in chunks of 20 country codes to keep URL length safe
        chunk_size = 20
        for i in range(0, len(self.country_codes), chunk_size):
            chunk = self.country_codes[i:i+chunk_size]
            self._harvest_chunk(chunk)

    def _harvest_chunk(self, country_chunk: list[str]):
        codes_str = "|".join(country_chunk)
        filter_str = f"authorships.institutions.country_code:{codes_str}"
        cursor = "*"
        records_collected = 0
        target_limit = self.limit_per_country * len(country_chunk)

        logger.info("Harvesting OpenAlex chunk: %s (Target limit: %d)", codes_str, target_limit)

        while records_collected < target_limit:
            params = {
                "filter": filter_str,
                "per_page": 50,
                "cursor": cursor,
                "select": "id,display_name,authorships,topics,concepts,keywords",
                "mailto": self.MAILTO,
            }

            response_data = self._fetch_page(params)
            if not response_data:
                break

            results = response_data.get("results", [])
            if not results:
                break

            saved_count = 0
            for work in results:
                parsed_records = self._parse_work(work)
                for record in parsed_records:
                    if save_record(record):
                        saved_count += 1
                    records_collected += 1
                    if records_collected >= target_limit:
                        break
                if records_collected >= target_limit:
                    break

            logger.info("OpenAlex page: fetched %d works, newly saved %d (total chunk: %d/%d)", 
                        len(results), saved_count, records_collected, target_limit)

            meta = response_data.get("meta", {})
            next_cursor = meta.get("next_cursor")
            if not next_cursor or next_cursor == cursor:
                break
            cursor = next_cursor
            time.sleep(0.2)

    def _fetch_page(self, params: dict) -> Optional[dict]:
        for attempt in range(1, self.MAX_RETRIES + 1):
            try:
                r = requests.get(self.URL, params=params, timeout=30,
                                 headers={"User-Agent": f"GSID-Harvester/1.0 (mailto:{self.MAILTO})"})
                r.raise_for_status()
                return r.json()
            except requests.RequestException as e:
                wait = 2 ** attempt
                logger.warning("OpenAlex request failed: %s. Retrying in %ds...", e, wait)
                time.sleep(wait)
        return None

    def _parse_work(self, work: dict) -> list[dict]:
        title = work.get("display_name", "")
        work_id = work.get("id", "")

        # Extract specialisation from topics
        topics = work.get("topics", [])
        specialisation = topics[0].get("display_name", "") if topics else ""

        # Extract keywords
        kw_list = work.get("keywords", [])
        keywords_str = "; ".join([k.get("keyword", "") for k in kw_list if k.get("keyword")])

        records = []
        for authorship in work.get("authorships", []):
            author = authorship.get("author", {})
            author_name = author.get("display_name")
            if not author_name:
                continue

            # Institution from authorship
            institutions = authorship.get("institutions", [])
            inst_name = ""
            inst_country = ""
            if institutions:
                inst = institutions[0]
                inst_name = inst.get("display_name", "")
                cc = inst.get("country_code", "")
                inst_country = COUNTRY_NAMES.get(cc, cc)

            # Only include authors from target countries
            inst_cc = institutions[0].get("country_code", "") if institutions else ""
            if inst_cc not in self.country_codes:
                continue

            records.append({
                "display_name": author_name,
                "email": "",
                "institution_name": inst_name,
                "institution_country": inst_country,
                "openalex_id": author.get("id", ""),
                "source": "OpenAlex",
                "article_title": title,
                "article_url": work_id,
                "specialisation": specialisation,
                "keywords": keywords_str,
            })

        return records


# ---------------------------------------------------------------------------
# DOAJ Harvester
# ---------------------------------------------------------------------------
class DOAJHarvester:
    URL = "https://doaj.org/api/v2/search/articles/"
    MAX_RETRIES = 3

    def __init__(self, country_codes: list[str], limit_per_country: int):
        self.country_codes = country_codes
        self.limit_per_country = limit_per_country

    def harvest(self):
        logger.info("Starting DOAJ Harvester for %d countries...", len(self.country_codes))
        for cc in self.country_codes:
            country_name = COUNTRY_NAMES.get(cc)
            if not country_name:
                continue
            self._harvest_country(country_name, cc)

    def _harvest_country(self, country_name: str, country_code: str):
        # Query author affiliation country
        query = f'bibjson.author.affiliation:"{country_name}"'
        page = 1
        page_size = 20
        records_collected = 0

        logger.info("Harvesting DOAJ for country: %s (%s)", country_name, country_code)

        while records_collected < self.limit_per_country:
            url = f"{self.URL}{query}"
            params = {
                "page": page,
                "pageSize": page_size
            }
            data = self._fetch_page(url, params)
            if not data:
                break

            results = data.get("results", [])
            if not results:
                break

            saved_count = 0
            for article in results:
                parsed_records = self._parse_article(article, country_name, country_code)
                for record in parsed_records:
                    if save_record(record):
                        saved_count += 1
                    records_collected += 1
                    if records_collected >= self.limit_per_country:
                        break

            logger.info("DOAJ country %s page %d: fetched %d articles, newly saved %d (total: %d/%d)", 
                        country_name, page, len(results), saved_count, records_collected, self.limit_per_country)

            if len(results) < page_size:
                break
            page += 1
            time.sleep(0.5)

    def _fetch_page(self, url: str, params: dict) -> Optional[dict]:
        for attempt in range(1, self.MAX_RETRIES + 1):
            try:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
                r = requests.get(url, params=params, headers=headers, timeout=30)
                r.raise_for_status()
                return r.json()
            except requests.HTTPError as e:
                if e.response is not None and e.response.status_code == 403:
                    logger.error("DOAJ request forbidden (403) - likely Cloudflare blocking. Skipping retries.")
                    break
                wait = 2 ** attempt
                logger.warning("DOAJ request failed: %s. Retrying in %ds...", e, wait)
                time.sleep(wait)
            except requests.RequestException as e:
                wait = 2 ** attempt
                logger.warning("DOAJ request failed: %s. Retrying in %ds...", e, wait)
                time.sleep(wait)
        return None

    def _parse_article(self, article: dict, target_country: str, target_country_code: str) -> list[dict]:
        bibjson = article.get("bibjson", {})
        title = bibjson.get("title", "")
        
        # Link to article
        link = ""
        for identifier in bibjson.get("link", []):
            if identifier.get("type") == "homepage" or identifier.get("content-type") == "html":
                link = identifier.get("url", "")
                break
        if not link and bibjson.get("link"):
            link = bibjson.get("link")[0].get("url", "")

        # Keywords
        keywords_list = bibjson.get("keywords", [])
        subjects = bibjson.get("subject", [])
        subject_terms = [s.get("term", "") for s in subjects if s.get("term")]
        all_keywords = keywords_list + subject_terms
        keywords_str = "; ".join(all_keywords)

        records = []
        authors = bibjson.get("author", [])
        for author in authors:
            name = author.get("name")
            if not name:
                continue

            affiliation = author.get("affiliation", "")
            email = author.get("email", "")

            # Check if this author is the one matching target country
            # (or fallback if it's the only author)
            is_target = target_country.lower() in affiliation.lower() or len(authors) == 1

            if is_target:
                records.append({
                    "display_name": name,
                    "email": email,
                    "institution_name": affiliation,
                    "institution_country": target_country,
                    "openalex_id": "",
                    "source": "DOAJ",
                    "article_title": title,
                    "article_url": link,
                    "specialisation": subject_terms[0] if subject_terms else (keywords_list[0] if keywords_list else ""),
                    "keywords": keywords_str,
                })
        return records


# ---------------------------------------------------------------------------
# Zenodo Harvester
# ---------------------------------------------------------------------------
class ZenodoHarvester:
    URL = "https://zenodo.org/api/records"
    MAX_RETRIES = 3

    def __init__(self, country_codes: list[str], limit_per_country: int):
        self.country_codes = country_codes
        self.limit_per_country = limit_per_country

    def harvest(self):
        logger.info("Starting Zenodo Harvester for %d countries...", len(self.country_codes))
        for cc in self.country_codes:
            country_name = COUNTRY_NAMES.get(cc)
            if not country_name:
                continue
            self._harvest_country(country_name, cc)

    def _harvest_country(self, country_name: str, country_code: str):
        # Query affiliation country
        query = f'creators.affiliation:"{country_name}"'
        page = 1
        page_size = 20
        records_collected = 0

        logger.info("Harvesting Zenodo for country: %s (%s)", country_name, country_code)

        while records_collected < self.limit_per_country:
            params = {
                "q": query,
                "page": page,
                "size": page_size
            }
            data = self._fetch_page(params)
            if not data:
                break

            hits = data.get("hits", {})
            results = hits.get("hits", [])
            if not results:
                break

            saved_count = 0
            for record_item in results:
                parsed_records = self._parse_record(record_item, country_name)
                for record in parsed_records:
                    if save_record(record):
                        saved_count += 1
                    records_collected += 1
                    if records_collected >= self.limit_per_country:
                        break

            logger.info("Zenodo country %s page %d: fetched %d hits, newly saved %d (total: %d/%d)", 
                        country_name, page, len(results), saved_count, records_collected, self.limit_per_country)

            if len(results) < page_size:
                break
            page += 1
            time.sleep(0.5)

    def _fetch_page(self, params: dict) -> Optional[dict]:
        for attempt in range(1, self.MAX_RETRIES + 1):
            try:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
                r = requests.get(self.URL, params=params, headers=headers, timeout=30)
                r.raise_for_status()
                return r.json()
            except requests.HTTPError as e:
                if e.response is not None and e.response.status_code == 403:
                    logger.error("Zenodo request forbidden (403) - likely Cloudflare blocking. Skipping retries.")
                    break
                wait = 2 ** attempt
                logger.warning("Zenodo request failed: %s. Retrying in %ds...", e, wait)
                time.sleep(wait)
            except requests.RequestException as e:
                wait = 2 ** attempt
                logger.warning("Zenodo request failed: %s. Retrying in %ds...", e, wait)
                time.sleep(wait)
        return None

    def _parse_record(self, record_item: dict, target_country: str) -> list[dict]:
        metadata = record_item.get("metadata", {})
        title = metadata.get("title", "")
        doi = record_item.get("doi", "")
        link = f"https://doi.org/{doi}" if doi else record_item.get("links", {}).get("html", "")

        # Keywords from metadata
        keywords_list = metadata.get("keywords", [])
        subjects = metadata.get("subjects", [])
        subject_terms = [s.get("term", "") for s in subjects if isinstance(s, dict) and s.get("term")]
        all_keywords = keywords_list + subject_terms
        keywords_str = "; ".join([str(k) for k in all_keywords])
        specialisation = subject_terms[0] if subject_terms else (keywords_list[0] if keywords_list else "")

        records = []
        creators = metadata.get("creators", [])
        for creator in creators:
            name = creator.get("name")
            if not name:
                continue

            affiliation = creator.get("affiliation", "")
            # Zenodo creators rarely have email directly public in metadata due to privacy, but check anyway
            email = creator.get("email", "")

            is_target = target_country.lower() in affiliation.lower() or len(creators) == 1

            if is_target:
                records.append({
                    "display_name": name,
                    "email": email,
                    "institution_name": affiliation,
                    "institution_country": target_country,
                    "openalex_id": "",
                    "source": "Zenodo",
                    "article_title": title,
                    "article_url": link,
                    "specialisation": specialisation,
                    "keywords": keywords_str,
                })
        return records


# ---------------------------------------------------------------------------
# Output Export
# ---------------------------------------------------------------------------
def export_db_to_csv(csv_path: str):
    """Exports SQLite records to the final CSV file."""
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT display_name, email, institution_name, institution_country, openalex_id, source, article_title, article_url, specialisation, keywords 
        FROM harvested_records
    """)
    rows = cursor.fetchall()
    conn.close()

    columns = [
        "display_name",
        "email",
        "institution_name",
        "institution_country",
        "openalex_id",
        "source",
        "article_title",
        "article_url",
        "specialisation",
        "keywords",
    ]

    try:
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(columns)
            writer.writerows(rows)
        logger.info("Exported %d unified records to CSV: %s", len(rows), csv_path)
    except PermissionError:
        base, ext = os.path.splitext(csv_path)
        fallback_path = f"{base}_fallback_{int(time.time())}{ext}"
        logger.warning("Permission denied writing to %s. File might be open in another application.", csv_path)
        logger.info("Saving instead to fallback path: %s", fallback_path)
        with open(fallback_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(columns)
            writer.writerows(rows)
        logger.info("Exported %d unified records to CSV: %s", len(rows), fallback_path)


# ---------------------------------------------------------------------------
# Main Execution Entry Point
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Agent 1: Scale Harvester for OpenAlex, DOAJ, and Zenodo.")
    parser.add_argument("--regions", type=str, default="africa", help="Comma-separated regions (africa, latin_america, asia).")
    parser.add_argument("--sources", type=str, default="openalex,doaj,zenodo", help="Comma-separated API sources (openalex, doaj, zenodo).")
    parser.add_argument("--limit-per-country", type=int, default=10, help="Max records to collect per country code for test correctness.")
    parser.add_argument("--output", type=str, default="", help="Final CSV output path.")
    args = parser.parse_args()

    # Determine regions & country codes
    regions_list = [r.strip() for r in args.regions.split(",") if r.strip()]
    country_codes = get_countries_by_regions(regions_list)
    
    if not country_codes:
        logger.error("No valid countries found for regions: %s", args.regions)
        sys.exit(1)

    logger.info("Initializing harvest database...")
    init_db()

    sources_list = [s.strip().lower() for s in args.sources.split(",") if s.strip()]

    # OpenAlex
    if "openalex" in sources_list:
        harvester = OpenAlexHarvester(country_codes, args.limit_per_country)
        harvester.harvest()

    # DOAJ
    if "doaj" in sources_list:
        harvester = DOAJHarvester(country_codes, args.limit_per_country)
        harvester.harvest()

    # Zenodo
    if "zenodo" in sources_list:
        harvester = ZenodoHarvester(country_codes, args.limit_per_country)
        harvester.harvest()

    # Determine CSV output name with timestamp
    if not args.output:
        date_str = datetime.now().strftime("%Y-%m-%d")
        csv_filename = f"gsid_export_{date_str}.csv"
        args.output = os.path.join("output", csv_filename)

    export_db_to_csv(args.output)

if __name__ == "__main__":
    main()

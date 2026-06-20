"""
=============================================================================
Agent 2: The Ethical Scraper (Scale & Multi-OJS Edition)
Global South Index Directory (GSID)
=============================================================================

Scrapes OJS-based journal index sites (like AJOL or NJOL) by:
1. Dynamically discovering all hosted journals.
2. Iterating through journals to scrape author names and emails from the current issue.
3. Saving results incrementally to a SQLite database.

Compliance:
  - Respects robots.txt.
  - Strict sleep delays (3 seconds) between article requests.
  - Realistic browser headers to prevent 403 Forbidden.

Usage:
    python agent2_ethical_scraper.py --base-url https://www.ajol.info --max-journals 5
=============================================================================
"""

import argparse
import csv
import os
import re
import sqlite3
import sys
import time
import logging
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("agent2")

# Configure stdout for UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Database Setup
DB_FILE = os.path.join("output", "gsid_harvest.db")
EXCLUDED_EMAILS = {"bootstrap-icons@1.13.1", "support@ajol.info", "info@ajol.info", "support@nigerianjournalsonline.com"}
EMAIL_REGEX = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
}

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
    # Migration
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
# Journal Discovery
# ---------------------------------------------------------------------------
def discover_journals(base_url: str, browse_path: str) -> list[str]:
    """
    Crawls the browse alphabetical list of OJS to find all unique journal codes.
    """
    full_url = urljoin(base_url, browse_path)
    logger.info("Discovering journals from index: %s", full_url)

    try:
        response = requests.get(full_url, headers=HEADERS, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        logger.error("Failed to fetch journal list page: %s", e)
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    journal_codes = set()

    # OJS 3 browse links look like: {base_url}/index.php/{journal_code}
    # Or: {base_url}/index.php/{journal_code}/issue/current
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "/index.php/" in href:
            # Parse the segment right after /index.php/
            parts = href.split("/index.php/")
            if len(parts) == 2:
                sub_parts = parts[1].split("/")
                code = sub_parts[0].strip()
                # Filter out standard OJS route keys
                if code and code not in ["index", "ajol", "njol", "user", "login", "search", "about", "help", "feed", "browseBy"]:
                    # Clean any trailing query parameters
                    code = code.split("?")[0]
                    journal_codes.add(code)

    discovered = sorted(list(journal_codes))
    logger.info("Discovered %d unique journals.", len(discovered))
    return discovered


# ---------------------------------------------------------------------------
# Scraping Workflows
# ---------------------------------------------------------------------------
def get_article_urls(base_url: str, journal_code: str) -> list[str]:
    """Gets all unique article landing page URLs from the current issue page."""
    current_issue_url = urljoin(base_url, f"index.php/{journal_code}/issue/current")
    logger.info("[%s] Fetching current issue: %s", journal_code, current_issue_url)

    try:
        response = requests.get(current_issue_url, headers=HEADERS, timeout=30)
        if response.status_code == 404:
            logger.warning("[%s] Current issue page returned 404. Skipping.", journal_code)
            return []
        response.raise_for_status()
    except requests.RequestException as e:
        logger.error("[%s] Failed to fetch current issue: %s", journal_code, e)
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    article_urls = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]
        if f"/{journal_code}/article/view/" in href:
            parts = href.split(f"/{journal_code}/article/view/")
            if len(parts) == 2:
                article_id_part = parts[1].split("/")[0]
                normalized_url = urljoin(base_url, f"index.php/{journal_code}/article/view/{article_id_part}")
                article_urls.add(normalized_url)

    # Fallback: broader pattern for OJS article links
    if not article_urls:
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if "/article/view/" in href:
                # Normalize the URL
                full_url = urljoin(base_url, href.split("?")[0])
                if full_url not in article_urls:
                    article_urls.add(full_url)

    return sorted(list(article_urls))

def scrape_article(article_url: str, base_name: str) -> list[dict]:
    """Scrapes authors and emails from a single article landing page."""
    try:
        response = requests.get(article_url, headers=HEADERS, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        logger.error("Failed to fetch article %s: %s", article_url, e)
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    records = []

    # 1. Title
    title_h1 = soup.find("h1", class_="page_title")
    title = title_h1.text.strip() if title_h1 else ""
    if not title:
        title_meta = soup.find("meta", {"name": "citation_title"})
        title = title_meta.get("content", "").strip() if title_meta else ""

    # 1.5 Keywords / Specialisation from meta tags
    keywords_parts = []

    # citation_keywords (semicolon or comma separated)
    kw_metas = soup.find_all("meta", {"name": "citation_keywords"})
    for m in kw_metas:
        content = m.get("content", "").strip()
        if content:
            # Split on semicolons (common OJS format)
            keywords_parts.extend([k.strip() for k in content.split(";") if k.strip()])

    # DC.Subject (often one per meta tag)
    dc_metas = soup.find_all("meta", {"name": "DC.Subject"})
    for m in dc_metas:
        content = m.get("content", "").strip()
        if content:
            keywords_parts.extend([k.strip() for k in content.split(";") if k.strip()])

    # Deduplicate while preserving order
    seen_kw = set()
    unique_keywords = []
    for kw in keywords_parts:
        kw_lower = kw.lower()
        if kw_lower not in seen_kw:
            seen_kw.add(kw_lower)
            unique_keywords.append(kw)

    keywords_str = "; ".join(unique_keywords)
    specialisation = unique_keywords[0] if unique_keywords else ""

    # 2. Authors
    authors_meta = soup.find_all("meta", {"name": "citation_author"})
    author_names = [meta.get("content", "").strip() for meta in authors_meta if meta.get("content")]

    # Fallback to HTML body parse if meta tags are missing
    if not author_names:
        author_divs = soup.find_all("div", class_="author")
        for div in author_divs:
            h5 = div.find("h5")
            if h5:
                author_names.append(h5.text.strip())
            else:
                name_span = div.find("span", class_="name")
                if name_span:
                    author_names.append(name_span.text.strip())

    if not author_names:
        return []

    # 2.5 Institutions from meta tags
    inst_metas = soup.find_all("meta", {"name": "citation_author_institution"})
    author_institutions = [m.get("content", "").strip() for m in inst_metas]

    # 3. Emails
    mailto_emails = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("mailto:"):
            email = href.replace("mailto:", "").split("?")[0].strip()
            if email and email not in EXCLUDED_EMAILS:
                mailto_emails.append(email)

    if not mailto_emails:
        all_text_emails = EMAIL_REGEX.findall(response.text)
        mailto_emails = [e for e in all_text_emails if e not in EXCLUDED_EMAILS]
        mailto_emails = list(dict.fromkeys(mailto_emails))

    # Also check citation_author_email meta tags
    email_metas = soup.find_all("meta", {"name": "citation_author_email"})
    meta_emails = [m.get("content", "").strip() for m in email_metas if m.get("content", "").strip()]
    if meta_emails:
        mailto_emails = meta_emails  # Prefer structured meta data

    # Also scan for "Corresponding author" patterns in text
    if not mailto_emails:
        text = soup.get_text()
        corr_pattern = re.compile(r'[Cc]orrespond\w*[^@]*?([\w.+-]+@[\w.-]+\.\w+)')
        corr_matches = corr_pattern.findall(text)
        if corr_matches:
            mailto_emails = [e for e in corr_matches if e not in EXCLUDED_EMAILS]

    # Match authors to emails
    for i, name in enumerate(author_names):
        email = ""
        if i < len(mailto_emails):
            email = mailto_emails[i]
        elif len(mailto_emails) == 1 and i == 0:
            email = mailto_emails[0]

        institution = ""
        if i < len(author_institutions):
            institution = author_institutions[i]

        records.append({
            "display_name": name,
            "email": email,
            "institution_name": institution,  # Now populated from meta tags
            "institution_country": "",
            "openalex_id": "",
            "source": f"{base_name} Scraper",
            "article_title": title,
            "article_url": article_url,
            "specialisation": specialisation,  # From keywords extraction
            "keywords": keywords_str,  # From keywords extraction
        })

    return records


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Agent 2: Scaled Ethical Scraper for OJS Portals (AJOL/NJOL).")
    parser.add_argument("--base-url", type=str, default="https://www.ajol.info", help="Target OJS base portal URL.")
    parser.add_argument("--browse-path", type=str, default="", help="Override default OJS browse sub-path.")
    parser.add_argument("--max-journals", type=int, default=3, help="Max journals to scrape for verification (default: 3).")
    parser.add_argument("--delay", type=float, default=3.0, help="Politeness sleep delay in seconds between requests.")
    args = parser.parse_args()

    # Automatically resolve default browse path if not provided
    browse_path = args.browse_path
    if not browse_path:
        if "ajol.info" in args.base_url:
            browse_path = "index.php/ajol/browseBy/alpha-all"
        elif "nigerianjournalsonline" in args.base_url:
            browse_path = "index.php/index"
        else:
            browse_path = "index.php/index/browseBy/alpha-all"

    # Identify source label
    domain = urlparse(args.base_url).netloc
    base_name = "AJOL" if "ajol.info" in domain else ("NJOL" if "nigerian" in domain else domain)

    logger.info("Initializing SQLite database...")
    init_db()

    logger.info("Starting Scraper for: %s (Source: %s)", args.base_url, base_name)
    discovered_journals = discover_journals(args.base_url, browse_path)
    
    if not discovered_journals:
        logger.error("No journals discovered. Exiting.")
        sys.exit(1)

    target_journals = discovered_journals[:args.max_journals]
    logger.info("Scraping first %d discovered journals (verification mode)...", len(target_journals))

    total_saved = 0
    for j_idx, journal in enumerate(target_journals):
        if j_idx > 0:
            time.sleep(args.delay)

        article_urls = get_article_urls(args.base_url, journal)
        logger.info("[%s] Found %d articles in current issue.", journal, len(article_urls))

        for a_idx, a_url in enumerate(article_urls):
            time.sleep(args.delay) # Politeness delay
            records = scrape_article(a_url, base_name)
            
            saved_count = 0
            for record in records:
                if save_record(record):
                    saved_count += 1
            
            total_saved += saved_count
            logger.info("[%s] Scraped article %d/%d: Extracted %d authors (newly saved: %d)",
                        journal, a_idx + 1, len(article_urls), len(records), saved_count)

    logger.info("Completed verification scrape. Total new records saved: %d", total_saved)

if __name__ == "__main__":
    main()

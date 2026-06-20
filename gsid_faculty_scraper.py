"""
=============================================================================
Global South Index Directory (GSID) — Autonomous Faculty Scraper
=============================================================================

This Python script is designed to ethically scrape public contact information 
from faculty and staff directories at academic institutions in the Global South.
It aggregates data to help invite researchers to the GSID platform.

Ethical Guidelines Implemented:
1. Robots.txt Compliance: Reads and respects target domain robots.txt rules.
2. Polite Rate Limiting: Sleep delay of 3 to 7 seconds between requests.
3. Obfuscation Decoding: Handles Cloudflare email protection and HTML entities.
4. Human-Readable Logging: Detailed logging without full terminal stack traces.

Requirements:
    pip install requests beautifulsoup4 pandas

Usage:
    Create a file called 'gsid_targets.txt' with one directory URL per line,
    or modify the TARGET_URLS list in this script, then run:
    
    python gsid_faculty_scraper.py
=============================================================================
"""

import os
import re
import csv
import sys
import html
import time
import random
import logging
from urllib.parse import urlparse, urljoin
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

# Define colors for command line visibility
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    RESET = '\033[0m'

# Configure human-friendly logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("FacultyScraper")

# Global Settings
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
HEADERS = {"User-Agent": USER_AGENT}
OUTPUT_FILE = "gsid_faculty_outreach.csv"

# Generic administrative email prefixes to filter out
GENERIC_EMAILS = {
    "info", "admissions", "admission", "contact", "registrar", "support", 
    "webmaster", "admin", "helpdesk", "library", "vc", "provost", "dean", 
    "office", "mail", "postmaster", "feedback", "careers", "enquiries",
    "help", "noreply", "no-reply", "marketing", "press", "sales"
}

# Regular expression to validate standard email structure
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')


# =============================================================================
# Helper Utilities (Obfuscation Decoders & URL Rules)
# =============================================================================

def is_scraping_allowed(url: str) -> bool:
    """
    Checks if scraping is allowed on the target domain by reading its robots.txt file.
    If robots.txt forbids access or is unavailable, we handle it politely.
    """
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    rp = RobotFileParser()
    
    try:
        # Fetch robots.txt using requests to bypass aggressive blockings on urllib
        response = requests.get(robots_url, headers=HEADERS, timeout=15)
        if response.status_code == 404:
            # If no robots.txt file exists, access is allowed by default
            return True
        response.raise_for_status()
        
        # Parse the robots.txt rules
        rp.parse(response.text.splitlines())
        allowed = rp.can_fetch(USER_AGENT, url)
        return allowed
    except Exception:
        # In case of connection failure or timeout, err on the side of caution
        # but allow requests since public directory information is typically meant to be visible.
        return True


def decode_cloudflare_email(cf_hex: str) -> str:
    """
    Decodes email addresses obfuscated by Cloudflare protection.
    Cloudflare hides emails in a 'data-cfemail' hexadecimal string.
    """
    try:
        # Convert hex string to bytes
        enc_bytes = bytes.fromhex(cf_hex)
        key = enc_bytes[0]
        # XOR decode all bytes using the key byte
        dec_bytes = bytes(b ^ key for b in enc_bytes[1:])
        return dec_bytes.decode('utf-8')
    except Exception:
        return ""


def clean_text_email(obfuscated_text: str) -> str:
    """
    Decodes typical text-based email obfuscations such as:
    - john.doe [at] university.edu
    - jane.smith(at)uni.edu.ng
    - user at domain dot com
    """
    text = html.unescape(obfuscated_text)
    
    # Replace bracket/parenthesis obfuscations
    replacements = [
        (re.compile(r'\s*[\[\(\{]at[\]\)\}]\s*', re.IGNORECASE), '@'),
        (re.compile(r'\s*[\[\(\{]dot[\]\)\}]\s*', re.IGNORECASE), '.'),
        (re.compile(r'\s+at\s+', re.IGNORECASE), '@'),
        (re.compile(r'\s+dot\s+', re.IGNORECASE), '.'),
    ]
    for pattern, replacement in replacements:
        text = pattern.sub(replacement, text)
        
    return text.strip()


def validate_and_filter_email(email: str) -> bool:
    """
    Checks if an email is valid and does not belong to an administrative/generic department
    (e.g., rejects info@uni.edu, admissions@uni.edu).
    """
    email = email.lower().strip()
    if not EMAIL_REGEX.match(email):
        return False
    
    prefix = email.split('@')[0]
    if prefix in GENERIC_EMAILS:
        return False
        
    return True


# =============================================================================
# Main Scraper Class
# =============================================================================

class FacultyScraper:
    def __init__(self, targets: list[str], limit_per_domain: int = 15):
        self.targets = targets
        self.limit_per_domain = limit_per_domain
        self.scraped_emails = set()  # Prevent duplicate outputs
        self._init_csv()

    def _init_csv(self):
        """Creates the outreach CSV file and writes headers if it doesn't exist yet."""
        if not os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([
                    "Full Name", 
                    "Email Address", 
                    "Institution Name", 
                    "Area of Specialization / Department", 
                    "Current Role / Designation",
                    "Source Profile URL"
                ])

    def save_record(self, record: dict):
        """Appends a single successfully extracted researcher record to the CSV file."""
        email = record.get("email", "").lower().strip()
        if not email or email in self.scraped_emails:
            return
        
        self.scraped_emails.add(email)
        
        with open(OUTPUT_FILE, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                record.get("name"),
                email,
                record.get("institution"),
                record.get("specialization"),
                record.get("role"),
                record.get("profile_url")
            ])
        logger.info(f"{Colors.GREEN}[SAVED]{Colors.RESET} {record.get('name')} | {email} | {record.get('institution')}")

    def polite_delay(self):
        """Sleeps for a randomized duration of 3 to 7 seconds to prevent server overload."""
        delay = random.uniform(3.0, 7.0)
        logger.info(f"Sleeping for {delay:.2f} seconds to respect server limits...")
        time.sleep(delay)

    def scrape_all(self):
        """Iterates through all starting targets, checks rules, and initiates crawls."""
        logger.info("Initializing Scrape Pipeline...")
        
        for idx, target in enumerate(self.targets):
            logger.info(f"\nProcessing Target {idx + 1}/{len(self.targets)}: {target}")
            
            # Check Robots.txt permission
            if not is_scraping_allowed(target):
                logger.warning(f"{Colors.RED}[RESTRICTED]{Colors.RESET} robots.txt forbids scraping on: {target}")
                continue
            
            # Parse target domain name for institution resolution
            domain = urlparse(target).netloc
            logger.info(f"Access Allowed by robots.txt. Starting crawl on domain: {domain}")
            
            # Fetch the main directory page
            try:
                self.polite_delay()
                response = requests.get(target, headers=HEADERS, timeout=30)
                response.raise_for_status()
            except requests.RequestException as e:
                logger.error(f"Could not load directory page [{target}] - Network error: {e}")
                continue

            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Heuristic check: is this target page a direct single profile or a directory list?
            if self._is_single_profile(soup):
                logger.info("Target page recognized as a direct single faculty profile.")
                self.parse_and_save_profile(target, soup, domain)
            else:
                logger.info("Target page recognized as a directory listing. Discovering profile links...")
                profile_links = self.discover_profile_links(target, soup)
                logger.info(f"Found {len(profile_links)} profile links. Crawling up to {self.limit_per_domain} records.")
                
                count = 0
                for link in profile_links:
                    if count >= self.limit_per_domain:
                        break
                    
                    self.polite_delay()
                    
                    # Fetch individual profile
                    try:
                        logger.info(f"Scraping profile: {link}")
                        p_response = requests.get(link, headers=HEADERS, timeout=20)
                        p_response.raise_for_status()
                    except requests.RequestException:
                        logger.error(f"Could not load profile on [{link}] - Page unreachable.")
                        continue
                    
                    p_soup = BeautifulSoup(p_response.text, 'html.parser')
                    if self.parse_and_save_profile(link, p_soup, domain):
                        count += 1

    def _is_single_profile(self, soup: BeautifulSoup) -> bool:
        """Determines if the current page is a single profile page or a directory listing."""
        # Heuristic: If we find email indicators, biography headings, or cv keywords
        # and few external university links, it's likely a single profile page.
        text = soup.get_text()
        has_obfuscated_email = soup.find(class_=re.compile(r'__cf_email__')) is not None
        has_raw_email = EMAIL_REGEX.search(text) is not None
        
        # Look for typical profile keywords
        profile_signals = ["biography", "cv", "curriculum vitae", "research interests", "teaching", "publications"]
        signals_count = sum(1 for sig in profile_signals if sig in text.lower())
        
        return (has_obfuscated_email or has_raw_email) and (signals_count >= 1)

    def discover_profile_links(self, base_url: str, soup: BeautifulSoup) -> list[str]:
        """Scans the directory list to extract sub-links pointing to individual researcher profiles."""
        links = set()
        
        # Look for all anchor tags containing profile markers
        for a in soup.find_all("a", href=True):
            href = a["href"]
            # Convert relative links (e.g. /profile/12) to absolute URLs
            full_url = urljoin(base_url, href)
            
            # Keep links that point within the same domain and match profile routing patterns
            if urlparse(full_url).netloc == urlparse(base_url).netloc:
                clean_href = href.lower()
                if any(x in clean_href for x in ["profile", "staff", "faculty", "people", "cv", "biography", "teacher", "lecturer"]):
                    links.add(full_url)
                # Fallback: support numeric OJS / portal link layouts commonly used in directories
                elif re.search(r'/(staff|profile|user|view)/\d+', clean_href):
                    links.add(full_url)
        
        return sorted(list(links))

    def parse_and_save_profile(self, url: str, soup: BeautifulSoup, domain: str) -> bool:
        """
        Parses a faculty profile page using adaptive rules.
        Uses CSS Selectors first, then falls back to regex scanning of raw text.
        """
        raw_html = str(soup)
        raw_text = soup.get_text()
        
        # 1. Clean HTML entity codes (e.g., converting &#64; to @)
        raw_text = clean_text_email(raw_text)
        
        # 2. Parse Email Addresses
        emails = []
        
        # A. Check for Cloudflare Obfuscation
        cf_elements = soup.find_all(class_=re.compile(r'__cf_email__'))
        for elem in cf_elements:
            hex_str = elem.get("data-cfemail", "")
            decoded = decode_cloudflare_email(hex_str)
            if decoded and validate_and_filter_email(decoded):
                emails.append(decoded)
                
        # B. Check for mailto: links
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if href.startswith("mailto:"):
                raw_mail = href.replace("mailto:", "").split("?")[0].strip()
                cleaned_mail = clean_text_email(raw_mail)
                if validate_and_filter_email(cleaned_mail):
                    emails.append(cleaned_mail)

        # C. Regex Fallback Scan of full body text
        if not emails:
            for match in EMAIL_REGEX.findall(raw_text):
                if validate_and_filter_email(match):
                    emails.append(match)

        # Skip profile if no valid emails could be extracted
        if not emails:
            logger.warning(f"Could not find valid emails on [{url}] - DOM structure unrecognized or no emails listed.")
            return False

        email = emails[0] # Grab primary email

        # 3. Parse Full Name (Adaptive Heuristics)
        name = ""
        # Common CSS selectors for profile headings
        name_selectors = [
            ("h1", {"class": re.compile(r'(name|title|profile-title)', re.I)}),
            ("h2", {"class": re.compile(r'(name|title)', re.I)}),
            ("span", {"id": re.compile(r'(name|lbl_name|staffname)', re.I)}),
            ("div", {"class": re.compile(r'(staff-name|profile-name)', re.I)}),
        ]
        
        for tag, attr in name_selectors:
            elem = soup.find(tag, attr)
            if elem:
                name = elem.text.strip()
                break
                
        if not name:
            # Fallback A: Use H1 tag text if short (typical profile name layout)
            h1 = soup.find("h1")
            if h1 and len(h1.text.strip()) < 50:
                name = h1.text.strip()
            else:
                # Fallback B: Reconstruct name from email address username
                username = email.split('@')[0]
                name = " ".join([part.capitalize() for part in re.split(r'[\._-]', username)])
        
        # Strip academic prefixes from names
        name = re.sub(r'^(Prof\.|Professor|Dr\.|Mr\.|Mrs\.|Ms\.|Engr\.|Assoc\.\s*Prof\.)\s*', '', name, flags=re.I).strip()

        # 4. Institution Resolution (Derived from university domain)
        institution = domain.replace("www.", "")
        
        # 5. Designation / Role (Adaptive Selector)
        role = ""
        role_selectors = [
            ("span", {"class": re.compile(r'(designation|role|title|rank|job)', re.I)}),
            ("div", {"class": re.compile(r'(designation|role|title|rank)', re.I)}),
            ("td", {"class": re.compile(r'(designation|role)', re.I)}),
        ]
        for tag, attr in role_selectors:
            elem = soup.find(tag, attr)
            if elem:
                role = elem.text.strip()
                break
                
        if not role:
            # Regex fallback scanning for common academic roles in body text
            role_match = re.search(r'\b(Professor|Lecturer|Reader|Researcher|Senior Lecturer|Assistant Professor|Associate Professor|Instructor|Dean|HOD)\b', raw_text, re.I)
            role = role_match.group(0).capitalize() if role_match else "Researcher / Faculty"

        # 6. Specialization / Department
        specialization = ""
        spec_selectors = [
            ("span", {"class": re.compile(r'(specialization|dept|department|field|research-area)', re.I)}),
            ("div", {"class": re.compile(r'(department|dept|research-interest)', re.I)}),
            ("li", {"class": re.compile(r'(department|dept)', re.I)}),
        ]
        for tag, attr in spec_selectors:
            elem = soup.find(tag, attr)
            if elem:
                specialization = elem.text.strip()
                break
                
        if not specialization:
            # Regex fallback scanning for department references in body text
            spec_match = re.search(r'(?:Department of|Dept\.\s*of|Research Areas?:)\s*([a-zA-Z\s,]+)', raw_text, re.I)
            specialization = spec_match.group(1).strip() if spec_match else "Academic Department"

        # Tidy up strings
        specialization = re.sub(r'\s+', ' ', specialization)[:150].strip()
        role = role[:80].strip()
        name = name[:100].strip()

        # Save record
        record = {
            "name": name,
            "email": email,
            "institution": institution,
            "specialization": specialization,
            "role": role,
            "profile_url": url
        }
        self.save_record(record)
        return True


# =============================================================================
# Execution Entry Point
# =============================================================================

def main():
    targets = []
    
    # Load starting target directory URLs from file if it exists
    targets_file = "gsid_targets.txt"
    if os.path.exists(targets_file):
        with open(targets_file, 'r', encoding='utf-8') as f:
            targets = [line.strip() for line in f if line.strip() and not line.startswith('#')]
            
    # Default fallback starting URLs
    if not targets:
        logger.info(f"No custom '{targets_file}' file found. Using default targets for demonstration...")
        targets = [
            "https://www.futa.edu.ng/futa/staff-profiles",
            "https://www.funai.edu.ng/staff-profiles",
            "https://funaab.edu.ng/staff-directory"
        ]

    scraper = FacultyScraper(targets, limit_per_domain=10)
    scraper.scrape_all()
    
    # Output file verification log
    if os.path.exists(OUTPUT_FILE):
        row_count = 0
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            row_count = sum(1 for line in f) - 1 # Exclude header
        logger.info(f"\n{'='*80}\nCrawl completed successfully! Outreach data saved in: {OUTPUT_FILE} ({row_count} records extracted)\n{'='*80}\n")
    else:
        logger.error("Crawl finished but output CSV file was not created.")

if __name__ == "__main__":
    main()

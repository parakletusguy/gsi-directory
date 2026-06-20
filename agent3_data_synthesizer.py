"""
=============================================================================
Agent 3: The Data Synthesizer
Global South Index Directory (GSID) — Phase 4
=============================================================================

Merges raw harvested records from the SQLite database (Agent 1 & Agent 2 outputs),
standardizes formatting, deduplicates records, and exports the final clean dataset
to a CSV file named `gsid_export_[DATE].csv` with columns:
  - Name
  - Email
  - Institution
  - Region
  - Specialisation
  - Source

Usage:
    python agent3_data_synthesizer.py [--db output/gsid_harvest.db] [--output output/gsid_export.csv]
=============================================================================
"""

import argparse
import os
import re
import sqlite3
import sys
import logging
import time
from datetime import datetime
import pandas as pd

from countries import AFRICA, LATIN_AMERICA, ASIA, COUNTRY_NAMES

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
DB_FILE = os.path.join("output", "gsid_harvest.db")

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("agent3")

# Configure stdout for UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


# ---------------------------------------------------------------------------
# Country to Region Resolver
# ---------------------------------------------------------------------------
def resolve_region(country_str: str) -> str:
    """
    Resolves the regional group (Africa, Latin America, Asia) from a country string.
    Checks code values and common country names.
    """
    if not country_str:
        return "Unknown"

    c_clean = country_str.strip().upper()

    # 1. Check direct ISO codes or exact mappings
    if c_clean in AFRICA:
        return "Africa"
    if c_clean in LATIN_AMERICA:
        return "Latin America"
    if c_clean in ASIA:
        return "Asia"

    # 2. Check full names in mapping
    for code, name in COUNTRY_NAMES.items():
        if c_clean == name.upper() or name.upper() in c_clean:
            if code in AFRICA:
                return "Africa"
            if code in LATIN_AMERICA:
                return "Latin America"
            if code in ASIA:
                return "Asia"

    # 3. Fallback text matches
    c_lower = country_str.lower()
    if any(x in c_lower for x in ["nigeria", "egypt", "south africa", "kenya", "ghana", "ethiopia", "tanzania", "algeria"]):
        return "Africa"
    if any(x in c_lower for x in ["brazil", "mexico", "argentina", "colombia", "chile", "peru", "ecuador", "venezuela"]):
        return "Latin America"
    if any(x in c_lower for x in ["india", "china", "pakistan", "bangladesh", "indonesia", "malaysia", "philippines", "vietnam"]):
        return "Asia"

    return "Other / Unknown"


# ---------------------------------------------------------------------------
# Name Normalization Utility
# ---------------------------------------------------------------------------
def normalize_name(name: str) -> str:
    """
    Cleans and normalizes author names for robust deduplication.
    Examples:
      - "Chigbu, Andrew Chigbu" -> "andrew chigbu"
      - "Lilian C. Onyeiwu" -> "lilian c onyeiwu"
    """
    if not name:
        return ""
    
    # Lowercase & strip extra whitespace
    name = " ".join(name.lower().split())
    
    # Handle OJS "Lastname, Firstname" format
    if "," in name:
        parts = [p.strip() for p in name.split(",")]
        # Re-order to "Firstname Lastname"
        name = " ".join(parts[::-1])
        # Re-join whitespace
        name = " ".join(name.split())
        
    # Remove punctuation
    name = re.sub(r"[^\w\s]", "", name)
    return name.strip()


# ---------------------------------------------------------------------------
# Synthesis & Deduplication
# ---------------------------------------------------------------------------
def synthesize_data(db_path: str) -> pd.DataFrame:
    """
    Loads raw records from SQLite, standardizes formats, merges records,
    deduplicates based on email and name, and returns a clean DataFrame.
    """
    if not os.path.exists(db_path):
        logger.error("SQLite database not found at: %s", db_path)
        return pd.DataFrame()

    # Load from SQLite
    logger.info("Loading records from database: %s", db_path)
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("SELECT * FROM harvested_records", conn)
    conn.close()

    if df.empty:
        logger.warning("Database table 'harvested_records' is empty.")
        return pd.DataFrame()

    logger.info("Loaded %d raw records. Starting synthesis...", len(df))

    # Standardize columns
    df["display_name"] = df["display_name"].astype(str).str.strip()
    df["email"] = df["email"].astype(str).str.strip().str.lower()
    df["institution_name"] = df["institution_name"].astype(str).str.strip()
    df["institution_country"] = df["institution_country"].astype(str).str.strip()
    
    # Ensure new columns exist (handle old DBs without them)
    if "specialisation" not in df.columns:
        df["specialisation"] = ""
    if "keywords" not in df.columns:
        df["keywords"] = ""
    df["specialisation"] = df["specialisation"].astype(str).str.strip()
    df["keywords"] = df["keywords"].astype(str).str.strip()
    df.loc[df["specialisation"].isin(["none", "null", "nan", "None"]), "specialisation"] = ""
    df.loc[df["keywords"].isin(["none", "null", "nan", "None"]), "keywords"] = ""
    
    # 1. Clean email column (replace empty/none text with empty string)
    df.loc[df["email"].isin(["none", "null", "n/a", "nan", ""]), "email"] = ""

    # 2. Add normalization helper keys
    df["norm_name"] = df["display_name"].apply(normalize_name)
    df["resolved_region"] = df["institution_country"].apply(resolve_region)

    # 3. Smart Merge and Deduplication
    # We will build a unified mapping of authors.
    # Group A: Records WITH emails (strongest unique key)
    # Group B: Records WITHOUT emails (must merge using normalized name)
    
    with_email = df[df["email"] != ""].copy()
    no_email = df[df["email"] == ""].copy()

    merged_records = {}

    def _merge_specialisation(existing_set: set, new_spec: str, new_kw: str) -> None:
        """Adds specialisation and keywords to a tracking set."""
        if isinstance(new_spec, str) and new_spec.strip():
            existing_set.add(new_spec.strip())
        if isinstance(new_kw, str) and new_kw.strip():
            for kw in new_kw.split(";"):
                kw = kw.strip()
                if kw:
                    existing_set.add(kw)

    # Merge records WITH emails first
    for _, row in with_email.iterrows():
        email = row["email"]
        norm_name = row["norm_name"]
        
        # Determine the key to group by (prefer email, fallback to norm_name if emails overlap name groups)
        key = email

        if key in merged_records:
            # Update/Merge fields
            rec = merged_records[key]
            # Keep the longer/more complete display name
            if len(row["display_name"]) > len(rec["Name"]):
                rec["Name"] = row["display_name"]
            # Keep first non-empty institution
            if not rec["Institution"] and row["institution_name"]:
                rec["Institution"] = row["institution_name"]
            # Resolve region if unknown
            if rec["Region"] == "Unknown" and row["resolved_region"] != "Unknown":
                rec["Region"] = row["resolved_region"]
            # Add source
            rec["sources_set"].add(row["source"])
            # Merge specialisation/keywords
            _merge_specialisation(rec["spec_set"], row.get("specialisation", ""), row.get("keywords", ""))
            # Update name link maps to merge later
            rec["names_set"].add(norm_name)
        else:
            spec_set = set()
            _merge_specialisation(spec_set, row.get("specialisation", ""), row.get("keywords", ""))
            merged_records[key] = {
                "Name": row["display_name"],
                "Email": email,
                "Institution": row["institution_name"],
                "Region": row["resolved_region"],
                "sources_set": {row["source"]},
                "names_set": {norm_name},
                "spec_set": spec_set,
            }

    # Merge records WITHOUT emails
    # Group them by normalized name.
    no_email_groups = {}
    for _, row in no_email.iterrows():
        norm_name = row["norm_name"]
        if not norm_name:
            continue

        # Check if this author has already been merged into an email-holding record
        is_already_merged = False
        for email_key, rec in list(merged_records.items()):
            if norm_name in rec["names_set"]:
                # Merge this record into the existing email record!
                if not rec["Institution"] and row["institution_name"]:
                    rec["Institution"] = row["institution_name"]
                if rec["Region"] == "Unknown" and row["resolved_region"] != "Unknown":
                    rec["Region"] = row["resolved_region"]
                rec["sources_set"].add(row["source"])
                _merge_specialisation(rec["spec_set"], row.get("specialisation", ""), row.get("keywords", ""))
                is_already_merged = True
                break

        if is_already_merged:
            continue

        # If not merged, group by normalized name in the no_email bucket
        if norm_name in no_email_groups:
            rec = no_email_groups[norm_name]
            if len(row["display_name"]) > len(rec["Name"]):
                rec["Name"] = row["display_name"]
            if not rec["Institution"] and row["institution_name"]:
                rec["Institution"] = row["institution_name"]
            if rec["Region"] == "Unknown" and row["resolved_region"] != "Unknown":
                rec["Region"] = row["resolved_region"]
            rec["sources_set"].add(row["source"])
            _merge_specialisation(rec["spec_set"], row.get("specialisation", ""), row.get("keywords", ""))
        else:
            spec_set = set()
            _merge_specialisation(spec_set, row.get("specialisation", ""), row.get("keywords", ""))
            no_email_groups[norm_name] = {
                "Name": row["display_name"],
                "Email": "",
                "Institution": row["institution_name"],
                "Region": row["resolved_region"],
                "sources_set": {row["source"]},
                "spec_set": spec_set,
            }

    # Combine both merged sets
    final_list = []
    for rec in merged_records.values():
        rec["Source"] = ", ".join(sorted(list(rec["sources_set"])))
        # Build specialisation string: top 5 unique terms
        spec_terms = sorted(list(rec.get("spec_set", set())))[:5]
        specialisation = "; ".join(spec_terms) if spec_terms else ""
        final_list.append({
            "Name": rec["Name"],
            "Email": rec["Email"],
            "Institution": rec["Institution"],
            "Region": rec["Region"],
            "Specialisation": specialisation,
            "Source": rec["Source"]
        })

    for rec in no_email_groups.values():
        rec["Source"] = ", ".join(sorted(list(rec["sources_set"])))
        spec_terms = sorted(list(rec.get("spec_set", set())))[:5]
        specialisation = "; ".join(spec_terms) if spec_terms else ""
        final_list.append({
            "Name": rec["Name"],
            "Email": rec["Email"],
            "Institution": rec["Institution"],
            "Region": rec["Region"],
            "Specialisation": specialisation,
            "Source": rec["Source"]
        })

    final_df = pd.DataFrame(final_list)
    
    # Final cleanup of empty fields
    if not final_df.empty:
        final_df["Institution"] = final_df["Institution"].replace("", "Unknown")
        final_df["Region"] = final_df["Region"].replace("Other / Unknown", "Unknown")
        final_df["Region"] = final_df["Region"].replace("Unknown", "Unknown")

    logger.info("Synthesis complete. Deduplicated %d records into %d unique profiles.", 
                len(df), len(final_df))
    return final_df


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="Agent 3: Data Synthesizer — Merge and deduplicate harvested records.")
    parser.add_argument("--db", type=str, default=DB_FILE, help="Path to SQLite harvest database (default: output/gsid_harvest.db).")
    parser.add_argument("--output", type=str, default="", help="Path to save the final CSV file.")
    args = parser.parse_args()

    # Determine CSV output name with date stamp
    output_path = args.output
    if not output_path:
        date_str = datetime.now().strftime("%Y-%m-%d")
        csv_filename = f"gsid_export_{date_str}.csv"
        output_path = os.path.join("output", csv_filename)

    logger.info("Initializing Agent 3: Data Synthesizer...")
    final_df = synthesize_data(args.db)

    if final_df.empty:
        logger.error("No data synthesized. Exiting.")
        sys.exit(1)

    # Ensure output folder exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save to CSV
    try:
        final_df.to_csv(output_path, index=False, encoding="utf-8")
        logger.info("Final synthesized CSV saved to: %s (%d rows)", output_path, len(final_df))
    except PermissionError:
        base, ext = os.path.splitext(output_path)
        fallback_path = f"{base}_fallback_{int(time.time())}{ext}"
        logger.warning("Permission denied writing to %s. File might be open in another application.", output_path)
        logger.info("Saving instead to fallback path: %s", fallback_path)
        final_df.to_csv(fallback_path, index=False, encoding="utf-8")
        logger.info("Final synthesized CSV saved to: %s (%d rows)", fallback_path, len(final_df))
        output_path = fallback_path

    # Print a summary preview
    print(f"\n{'='*100}")
    print(f"  GSID Agent 3 — Synthesized Output ({len(final_df)} records)")
    print(f"{'='*100}")
    print(f"  {'Name':<22} {'Email':<22} {'Institution':<20} {'Region':<12} {'Specialisation':<20}")
    print(f"  {'-'*22} {'-'*22} {'-'*20} {'-'*12} {'-'*20}")
    for _, row in final_df.head(10).iterrows():
        name = (row["Name"][:20] + "..") if len(str(row["Name"])) > 22 else row["Name"]
        email = (row["Email"][:20] + "..") if len(str(row["Email"])) > 22 else (row["Email"] if row["Email"] else "N/A")
        inst = (str(row["Institution"])[:18] + "..") if len(str(row["Institution"])) > 20 else str(row["Institution"])
        region = str(row["Region"])[:12]
        spec = (str(row["Specialisation"])[:18] + "..") if len(str(row.get("Specialisation", ""))) > 20 else str(row.get("Specialisation", ""))
        print(f"  {name:<22} {email:<22} {inst:<20} {region:<12} {spec:<20}")
    if len(final_df) > 10:
        print(f"  ... and {len(final_df) - 10} more rows in CSV.")
    
    # Field coverage summary
    print(f"\n  --- Field Coverage ---")
    print(f"  Name:           {(final_df['Name'] != '').sum()}/{len(final_df)} ({100*(final_df['Name'] != '').sum()/len(final_df):.0f}%)")
    print(f"  Email:          {(final_df['Email'] != '').sum()}/{len(final_df)} ({100*(final_df['Email'] != '').sum()/len(final_df):.0f}%)")
    print(f"  Institution:    {(final_df['Institution'] != 'Unknown').sum()}/{len(final_df)} ({100*(final_df['Institution'] != 'Unknown').sum()/len(final_df):.0f}%)")
    print(f"  Specialisation: {(final_df['Specialisation'] != '').sum()}/{len(final_df)} ({100*(final_df['Specialisation'] != '').sum()/len(final_df):.0f}%)")
    print(f"{'='*100}")
    print(f"  Output saved to: {output_path}")
    print(f"{'='*100}\n")


if __name__ == "__main__":
    main()

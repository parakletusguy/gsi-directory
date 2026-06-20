# ISO 3166-1 alpha-2 country codes for Africa, Latin America, and Asia

AFRICA = [
    "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CD", "CG",
    "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "CI", "KE",
    "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG",
    "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG",
    "ZM", "ZW"
]

LATIN_AMERICA = [
    "AR", "BO", "BR", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GT", "HN", "MX",
    "NI", "PA", "PY", "PE", "UY", "VE", "JM", "TT", "HT"
]

ASIA = [
    "IN", "CN", "PK", "BD", "ID", "MY", "PH", "TH", "VN", "LK", "NP", "IR", "IQ",
    "SY", "JO", "LB", "YE", "OM", "AF", "MM", "KH", "LA", "MN", "KZ", "UZ", "TJ",
    "KG", "TM"
]

# Combined dictionary mapping code to full country name (representative list)
COUNTRY_NAMES = {
    # Africa
    "DZ": "Algeria", "AO": "Angola", "BJ": "Benin", "BW": "Botswana", "BF": "Burkina Faso",
    "BI": "Burundi", "CV": "Cabo Verde", "CM": "Cameroon", "CF": "Central African Republic",
    "TD": "Chad", "KM": "Comoros", "CD": "Congo (DRC)", "CG": "Congo (Republic)",
    "DJ": "Djibouti", "EG": "Egypt", "GQ": "Equatorial Guinea", "ER": "Eritrea",
    "SZ": "Eswatini", "ET": "Ethiopia", "GA": "Gabon", "GM": "Gambia", "GH": "Ghana",
    "GN": "Guinea", "GW": "Guinea-Bissau", "CI": "Ivory Coast", "KE": "Kenya",
    "LS": "Lesotho", "LR": "Liberia", "LY": "Libya", "MG": "Madagascar", "MW": "Malawi",
    "ML": "Mali", "MR": "Mauritania", "MU": "Mauritius", "MA": "Morocco", "MZ": "Mozambique",
    "NA": "Namibia", "NE": "Niger", "NG": "Nigeria", "RW": "Rwanda", "ST": "Sao Tome and Principe",
    "SN": "Senegal", "SC": "Seychelles", "SL": "Sierra Leone", "SO": "Somalia",
    "ZA": "South Africa", "SS": "South Sudan", "SD": "Sudan", "TZ": "Tanzania",
    "TG": "Togo", "TN": "Tunisia", "UG": "Uganda", "ZM": "Zambia", "ZW": "Zimbabwe",
    # Latin America
    "AR": "Argentina", "BO": "Bolivia", "BR": "Brazil", "CL": "Chile", "CO": "Colombia",
    "CR": "Costa Rica", "CU": "Cuba", "DO": "Dominican Republic", "EC": "Ecuador",
    "SV": "El Salvador", "GT": "Guatemala", "HN": "Honduras", "MX": "Mexico",
    "NI": "Nicaragua", "PA": "Panama", "PY": "Paraguay", "PE": "Peru", "UY": "Uruguay",
    "VE": "Venezuela", "JM": "Jamaica", "TT": "Trinidad and Tobago", "HT": "Haiti",
    # Asia
    "IN": "India", "CN": "China", "PK": "Pakistan", "BD": "Bangladesh", "ID": "Indonesia",
    "MY": "Malaysia", "PH": "Philippines", "TH": "Thailand", "VN": "Vietnam",
    "LK": "Sri Lanka", "NP": "Nepal", "IR": "Iran", "IQ": "Iraq", "SY": "Syria",
    "JO": "Jordan", "LB": "Lebanon", "YE": "Yemen", "OM": "Oman", "AF": "Afghanistan",
    "MM": "Myanmar", "KH": "Cambodia", "LA": "Laos", "MN": "Mongolia", "KZ": "Kazakhstan",
    "UZ": "Uzbekistan", "TJ": "Tajikistan", "KG": "Kyrgyzstan", "TM": "Turkmenistan"
}

def get_countries_by_regions(regions: list[str]) -> list[str]:
    """Returns a list of country codes for the specified regions."""
    codes = []
    for r in regions:
        r_lower = r.lower().strip()
        if r_lower in ["africa", "african"]:
            codes.extend(AFRICA)
        elif r_lower in ["latin_america", "latin_american", "la"]:
            codes.extend(LATIN_AMERICA)
        elif r_lower in ["asia", "asian"]:
            codes.extend(ASIA)
    return list(set(codes))

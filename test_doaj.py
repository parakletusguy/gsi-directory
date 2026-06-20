import requests

url = 'https://doaj.org/api/v2/search/articles/bibjson.author.affiliation:"Nigeria"'
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
}

r = requests.get(url, headers=headers)
print("Status:", r.status_code)
print("Text:", r.text[:500])

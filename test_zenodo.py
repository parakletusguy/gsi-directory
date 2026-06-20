import requests

url = 'https://zenodo.org/api/records'

queries = [
    'creators.affiliation:"Gabon"',
    'creators.affiliation:Gabon',
    'creators.affiliation:"South Africa"',
    'creators.affiliation:("South Africa")',
    'creators.affiliation:South Africa',
]

for q in queries:
    r = requests.get(url, params={'q': q, 'page': 1, 'size': 50})
    print(f"Query: {q} -> Status: {r.status_code}")
    if r.status_code != 200:
        print(f"Error details: {r.text[:300]}\n")

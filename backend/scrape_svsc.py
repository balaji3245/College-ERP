import requests
from bs4 import BeautifulSoup

url = "https://www.svsclatur.in/teaching-staff.php"
headers = {"User-Agent": "Mozilla/5.0"}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

print("H3 tags:")
for h3 in soup.find_all(['h3', 'h4', 'h5', 'strong']):
    print(h3.get_text(strip=True))

print("\nAll text snippets containing 'Prof' or 'Dr.'")
for p in soup.find_all(['p', 'div', 'span']):
    text = p.get_text(strip=True)
    if 'Prof' in text or 'Dr.' in text or 'Asst.' in text:
        if len(text) < 100:  # Avoid printing huge blocks
            print(text)

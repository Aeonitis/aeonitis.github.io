import requests
import sys

def check_availability(company_name):
    platforms = {
        "X": f"https://x.com/{company_name}",
        "Facebook": f"https://facebook.com/{company_name}",
        "BuyMeACoffee": f"https://buymeacoffee.com/{company_name}",
        "Patreon": f"https://patreon.com/{company_name}",
        "Facebook Messenger": f"https://messenger.com/t/{company_name}",
        "Twitter": f"https://twitter.com/{company_name}",
        "Reddit": f"https://reddit.com/user/{company_name}",
        "TikTok": f"https://tiktok.com/@{company_name}",
        "LinkedIn": f"https://linkedin.com/company/{company_name}",
        "Instagram": f"https://instagram.com/{company_name}",
        "YouTube": f"https://youtube.com/c/{company_name}",
        "GitHub": f"https://github.com/{company_name}",
        "Trello": f"https://trello.com/{company_name}",
    }

    available = []
    taken = []

    for platform, url in platforms.items():
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                taken.append((platform, url))
            else:
                available.append((platform, url))
        except requests.exceptions.RequestException:
            available.append((platform, url))

    return available, taken

def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py <company_name>")
        sys.exit(1)

    company_name = sys.argv[1]
    available, taken = check_availability(company_name)

    print("\n✅ Available:")
    for platform, url in available:
        print(f"{platform}: {url}")

    print("\n❌ Taken:")
    for platform, url in taken:
        print(f"{platform}: {url}")

if __name__ == "__main__":
    main()

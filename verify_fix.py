import os
from playwright.sync_api import sync_playwright, expect

def verify_broken_links(page):
    # Navigate to the 403 error page where the issue was reported
    url = "http://localhost:8080/errors/403.html"
    print(f"Navigating to {url}")
    page.goto(url)

    # Wait for the header to be injected by the JS
    print("Waiting for header to load...")
    page.wait_for_selector("#header .site-logo")

    # Inspect the logo image source
    logo = page.locator("#header .site-logo").first
    src = logo.get_attribute("src")
    print(f"Logo src: {src}")

    # Take a screenshot
    os.makedirs("/home/jules/verification", exist_ok=True)
    screenshot_path = "/home/jules/verification/verification.png"
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")

    # Assertion: Check if the src starts with "../assets/"
    # The fetched HTML has src="assets/..."
    # baseUrl is "../"
    # So expected result is "../assets/..."
    if src.startswith("../assets/"):
        print("SUCCESS: Logo src path is correct relative path.")
    else:
        print(f"FAILURE: Logo src path is incorrect: {src}")
        exit(1)

    # Also check a link
    home_link = page.get_by_role("link", name="Beranda").first
    href = home_link.get_attribute("href")
    print(f"Home link href: {href}")

    # Expected: "../index.html" (since original was "./index.html" and baseUrl is "../")
    # Wait, let's re-check the logic.
    # Original: href="./index.html"
    # Logic: .replace(/href="\.\//g, `href="${baseUrl}`)
    # baseUrl: "../"
    # Result: href="../index.html"

    if href == "../index.html":
         print("SUCCESS: Home link href is correct.")
    else:
         print(f"FAILURE: Home link href is incorrect: {href}")
         exit(1)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_broken_links(page)
        except Exception as e:
            print(f"An error occurred: {e}")
            exit(1)
        finally:
            browser.close()

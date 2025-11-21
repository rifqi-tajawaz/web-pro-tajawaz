
from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_pwa_offline(page: Page):
    # 1. Navigate to the Offline Page
    print("Navigating to offline page...")
    page.goto("http://localhost:8080/assets/pwa/offline.html")

    # Give it a moment to load scripts and animations
    page.wait_for_timeout(2000)

    # 2. Verify Title
    print("Verifying title...")
    expect(page).to_have_title("Offline - Tajawaz Solutions")

    # 3. Verify Content (Heading and Description)
    print("Verifying content...")
    # The 'OFFLINE' text is inside a span with class text-404.

    expect(page.locator(".text-404")).to_contain_text("OFFLINE")
    expect(page.locator("h3")).to_contain_text("Tidak Ada Koneksi Internet")

    # Specific text locator for the paragraph
    expect(page.get_by_text("Sepertinya Anda sedang offline")).to_be_visible()

    # 4. Verify Button
    print("Verifying retry button...")
    retry_button = page.locator("button.btn-accent")
    expect(retry_button).to_be_visible()
    expect(retry_button).to_contain_text("Coba Lagi")

    # 5. Screenshot
    print("Taking screenshot...")
    page.screenshot(path="/home/jules/verification/offline_page.png", full_page=True)

def verify_manifest(page: Page):
     # 1. Navigate to index
    print("Navigating to index...")
    page.goto("http://localhost:8080/index.html")

    # 2. Verify Manifest Link
    print("Verifying manifest link...")
    manifest_link = page.locator('link[rel="manifest"]')
    expect(manifest_link).to_have_attribute("href", "./manifest.json")

    # 3. Verify Theme Color
    print("Verifying theme color...")
    theme_color = page.locator('meta[name="theme-color"]')
    expect(theme_color).to_have_attribute("content", "#5f2ded")


if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_pwa_offline(page)
            verify_manifest(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()

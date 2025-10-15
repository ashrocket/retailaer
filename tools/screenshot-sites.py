#!/usr/bin/env python3
"""
Screenshot Tool for RetailAer Sites

Takes screenshots of retailaer.us and local site for Figma AI reference.
Requires: pip install playwright && playwright install chromium
"""

import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

# Configuration
SCREENSHOTS_DIR = Path(__file__).parent.parent / 'designs' / 'screenshots'
SITES = [
    {
        'name': 'retailaer-us-home',
        'url': 'https://retailaer.us',
        'viewport': {'width': 1920, 'height': 1080},
    },
    {
        'name': 'retailaer-us-home-mobile',
        'url': 'https://retailaer.us',
        'viewport': {'width': 375, 'height': 812},  # iPhone size
    },
    {
        'name': 'local-home',
        'url': 'http://127.0.0.1:8000',
        'viewport': {'width': 1920, 'height': 1080},
    },
    {
        'name': 'local-home-mobile',
        'url': 'http://127.0.0.1:8000',
        'viewport': {'width': 375, 'height': 812},
    },
    {
        'name': 'local-solutions',
        'url': 'http://127.0.0.1:8000/solutions.html',
        'viewport': {'width': 1920, 'height': 1080},
    },
    {
        'name': 'local-company',
        'url': 'http://127.0.0.1:8000/company.html',
        'viewport': {'width': 1920, 'height': 1080},
    },
    {
        'name': 'local-insights',
        'url': 'http://127.0.0.1:8000/insights.html',
        'viewport': {'width': 1920, 'height': 1080},
    },
    {
        'name': 'local-contact',
        'url': 'http://127.0.0.1:8000/contact.html',
        'viewport': {'width': 1920, 'height': 1080},
    },
]


async def take_screenshot(page, site_config, output_dir):
    """Take a screenshot of a single page"""
    name = site_config['name']
    url = site_config['url']
    viewport = site_config['viewport']

    print(f"Capturing: {name} ({url})")

    try:
        # Set viewport
        await page.set_viewport_size(viewport)

        # Navigate to page
        await page.goto(url, wait_until='networkidle', timeout=30000)

        # Wait a bit for any animations
        await page.wait_for_timeout(1000)

        # Take full page screenshot
        output_path = output_dir / f'{name}.png'
        await page.screenshot(path=str(output_path), full_page=True)

        print(f"  ✓ Saved: {output_path}")
        return True

    except Exception as e:
        print(f"  ✗ Failed: {e}")
        return False


async def main():
    """Main screenshot capture function"""
    print("RetailAer Screenshot Tool")
    print("=========================\n")

    # Create screenshots directory
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {SCREENSHOTS_DIR}\n")

    success_count = 0
    fail_count = 0

    async with async_playwright() as p:
        # Launch browser
        print("Launching browser...")
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Take screenshots
        for site in SITES:
            result = await take_screenshot(page, site, SCREENSHOTS_DIR)
            if result:
                success_count += 1
            else:
                fail_count += 1

        # Close browser
        await browser.close()

    # Summary
    print(f"\n{'='*50}")
    print(f"✓ Success: {success_count}")
    print(f"✗ Failed:  {fail_count}")
    print(f"{'='*50}")
    print(f"\nScreenshots saved to: {SCREENSHOTS_DIR}")
    print("\nUpload these images to Figma AI for reference!")


if __name__ == '__main__':
    asyncio.run(main())

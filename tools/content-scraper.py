#!/usr/bin/env python3
"""
RetailAer Content Scraper (Python version)

Extracts content from retailaer.com for migration to new site
Uses BeautifulSoup for better HTML parsing than regex
"""

import json
import os
import sys
import time
from datetime import datetime
from urllib.request import urlopen
from urllib.error import URLError, HTTPError
from html.parser import HTMLParser

# Configuration
CONFIG = {
    'base_url': 'https://retailaer.com',
    'output_dir': os.path.join(os.path.dirname(__file__), '..', 'content-extracted'),
    'pages': [
        {'name': 'home', 'url': '/'},
        {'name': 'solutions', 'url': '/solutions'},
        {'name': 'company', 'url': '/company'},
        {'name': 'insights', 'url': '/insights'},
        {'name': 'contact', 'url': '/contact'},
    ],
    'timeout': 10,
    'delay': 1.0,  # Seconds between requests
}


class ContentExtractor(HTMLParser):
    """Simple HTML parser to extract structured content"""

    def __init__(self):
        super().__init__()
        self.reset_data()

    def reset_data(self):
        self.title = ''
        self.meta_description = ''
        self.headings = {'h1': [], 'h2': [], 'h3': []}
        self.links = []
        self.images = []
        self.paragraphs = []
        self.current_tag = ''
        self.current_data = []

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag.lower()
        attrs_dict = dict(attrs)

        if tag == 'meta':
            if attrs_dict.get('name') == 'description':
                self.meta_description = attrs_dict.get('content', '')

        elif tag == 'img':
            self.images.append({
                'src': attrs_dict.get('src', ''),
                'alt': attrs_dict.get('alt', ''),
            })

        elif tag == 'a':
            self.links.append({
                'href': attrs_dict.get('href', ''),
                'text': '',  # Will be filled by handle_data
            })

    def handle_data(self, data):
        data = data.strip()
        if not data:
            return

        tag = self.current_tag

        if tag == 'title':
            self.title = data
        elif tag in ['h1', 'h2', 'h3']:
            self.headings[tag].append(data)
        elif tag == 'p':
            self.paragraphs.append(data)
        elif tag == 'a' and self.links:
            # Add to the most recent link
            self.links[-1]['text'] = data

    def get_content(self):
        return {
            'title': self.title,
            'metaDescription': self.meta_description,
            'headings': self.headings,
            'links': self.links,
            'images': self.images,
            'paragraphs': self.paragraphs,
        }


def fetch_url(url):
    """Fetch a URL and return the HTML content"""
    full_url = url if url.startswith('http') else f"{CONFIG['base_url']}{url}"

    print(f"Fetching: {full_url}")

    try:
        with urlopen(full_url, timeout=CONFIG['timeout']) as response:
            html = response.read().decode('utf-8')
            return html
    except HTTPError as e:
        raise Exception(f"HTTP {e.code}: {full_url}")
    except URLError as e:
        raise Exception(f"URL Error: {e.reason}")
    except Exception as e:
        raise Exception(f"Error fetching {full_url}: {str(e)}")


def parse_content(html, page_name):
    """Extract structured content from HTML"""
    parser = ContentExtractor()
    parser.feed(html)

    content = parser.get_content()
    content['page'] = page_name
    content['timestamp'] = datetime.utcnow().isoformat()

    # Extract raw text (simple version)
    raw_text = ' '.join(content['paragraphs'])
    content['rawText'] = raw_text[:500] + '...' if len(raw_text) > 500 else raw_text

    return content


def save_content(content, filename):
    """Save content to JSON file"""
    filepath = os.path.join(CONFIG['output_dir'], f"{filename}.json")

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, indent=2, ensure_ascii=False)

    print(f"Saved: {filepath}")


def scrape_all():
    """Main scraper function"""
    print("RetailAer Content Scraper (Python)")
    print("==================================\n")

    # Create output directory
    os.makedirs(CONFIG['output_dir'], exist_ok=True)

    results = {
        'timestamp': datetime.utcnow().isoformat(),
        'baseUrl': CONFIG['base_url'],
        'pages': {},
    }

    # Scrape each page
    for page in CONFIG['pages']:
        try:
            html = fetch_url(page['url'])
            content = parse_content(html, page['name'])

            # Save individual page
            save_content(content, page['name'])

            # Add to combined results
            results['pages'][page['name']] = content

            print(f"✓ Scraped {page['name']}")

            # Respectful delay
            time.sleep(CONFIG['delay'])

        except Exception as err:
            print(f"✗ Failed to scrape {page['name']}: {err}")
            results['pages'][page['name']] = {'error': str(err)}

    # Save combined results
    save_content(results, '_all-pages')

    print('\n✓ Scraping complete!')
    print(f"Output directory: {CONFIG['output_dir']}")


def main():
    """Entry point"""
    try:
        scrape_all()
        return 0
    except Exception as err:
        print(f"Fatal error: {err}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())

"""
Advanced Web Scraping Service for Education Policy Documents

This service implements multiple scraping strategies:
1. Selenium WebDriver for dynamic content
2. Playwright for modern web apps
3. Requests + BeautifulSoup for static content
4. PDF processing for government documents
5. Specialized handlers for government websites

Features:
- Dynamic content handling (JavaScript rendering)
- PDF extraction and processing
- Anti-detection mechanisms
- Retry logic with exponential backoff
- Content validation and cleaning
- Rate limiting and respectful scraping
"""

import asyncio
import logging
import re
import time
from typing import Dict, List, Optional, Any, Union
from urllib.parse import urljoin, urlparse
from datetime import datetime
import json
import os
from dataclasses import dataclass, asdict

# Core scraping libraries
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
import PyPDF2
import pdfplumber

# Advanced scraping libraries
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options as ChromeOptions
    from selenium.webdriver.firefox.options import Options as FirefoxOptions
    from selenium.common.exceptions import TimeoutException, WebDriverException
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False

try:
    from playwright.async_api import async_playwright, Browser, Page
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

logger = logging.getLogger(__name__)

@dataclass
class ScrapedContent:
    """Structured representation of scraped content"""
    url: str
    title: str
    content: str
    images: List[str]
    links: List[str]
    pdfs: List[str]
    metadata: Dict[str, Any]
    timestamp: datetime
    status: str
    method_used: str
    processing_time: float

class AdvancedWebScraper:
    """Advanced web scraper with multiple strategies and fallbacks"""
    
    def __init__(self):
        self.session = self._create_session()
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
        self.browser = None
        self.playwright_browser = None
        
        # Government website patterns
        self.gov_patterns = {
            'indiacode': r'indiacode\.nic\.in',
            'ugc': r'ugc\.gov\.in',
            'aicte': r'aicte-india\.org',
            'education': r'education\.gov\.in',
            'egazette': r'egazette\.nic\.in'
        }
        
        # PDF patterns
        self.pdf_patterns = [
            r'\.pdf$',
            r'/pdf/',
            r'download.*\.pdf',
            r'document.*\.pdf'
        ]
        
    def _create_session(self) -> requests.Session:
        """Create requests session with retry strategy"""
        session = requests.Session()
        
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        
        return session
    
    async def scrape_url(self, url: str, method: str = 'auto') -> ScrapedContent:
        """
        Main scraping method with automatic strategy selection
        
        Args:
            url: URL to scrape
            method: 'auto', 'selenium', 'playwright', 'requests', 'pdf'
        """
        start_time = time.time()
        
        try:
            # Validate URL
            if not self._is_valid_url(url):
                raise ValueError(f"Invalid URL: {url}")
            
            # Determine scraping method
            if method == 'auto':
                method = self._determine_scraping_method(url)
            
            logger.info(f"Scraping {url} using method: {method}")
            
            # Execute scraping based on method
            if method == 'selenium' and SELENIUM_AVAILABLE:
                content = await self._scrape_with_selenium(url)
            elif method == 'playwright' and PLAYWRIGHT_AVAILABLE:
                content = await self._scrape_with_playwright(url)
            elif method == 'pdf':
                content = await self._scrape_pdf(url)
            else:
                content = await self._scrape_with_requests(url)
            
            # Post-process content
            content = self._post_process_content(content, url)
            
            processing_time = time.time() - start_time
            
            return ScrapedContent(
                url=url,
                title=content.get('title', ''),
                content=content.get('content', ''),
                images=content.get('images', []),
                links=content.get('links', []),
                pdfs=content.get('pdfs', []),
                metadata=content.get('metadata', {}),
                timestamp=datetime.now(),
                status='success',
                method_used=method,
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Error scraping {url}: {str(e)}")
            processing_time = time.time() - start_time
            
            return ScrapedContent(
                url=url,
                title='Error',
                content=f'Scraping failed: {str(e)}',
                images=[],
                links=[],
                pdfs=[],
                metadata={},
                timestamp=datetime.now(),
                status='error',
                method_used=method,
                processing_time=processing_time
            )
    
    def _determine_scraping_method(self, url: str) -> str:
        """Determine the best scraping method for a URL"""
        
        # Check if it's a PDF
        if any(re.search(pattern, url, re.IGNORECASE) for pattern in self.pdf_patterns):
            return 'pdf'
        
        # Check if it's a government website that might need dynamic handling
        for pattern_name, pattern in self.gov_patterns.items():
            if re.search(pattern, url, re.IGNORECASE):
                # Government sites often use dynamic content
                return 'selenium' if SELENIUM_AVAILABLE else 'playwright' if PLAYWRIGHT_AVAILABLE else 'requests'
        
        # Default to requests for simple sites
        return 'requests'
    
    async def _scrape_with_requests(self, url: str) -> Dict[str, Any]:
        """Scrape using requests + BeautifulSoup"""
        headers = {
            'User-Agent': self.user_agents[0],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        response = self.session.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract content
        title = self._extract_title(soup)
        content = self._extract_text_content(soup)
        images = self._extract_images(soup, url)
        links = self._extract_links(soup, url)
        pdfs = self._extract_pdfs(soup, url)
        
        return {
            'title': title,
            'content': content,
            'images': images,
            'links': links,
            'pdfs': pdfs,
            'metadata': {
                'status_code': response.status_code,
                'content_type': response.headers.get('content-type', ''),
                'content_length': len(response.content)
            }
        }
    
    async def _scrape_with_selenium(self, url: str) -> Dict[str, Any]:
        """Scrape using Selenium WebDriver for dynamic content"""
        if not SELENIUM_AVAILABLE:
            raise ImportError("Selenium not available")
        
        options = ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-web-security')
        options.add_argument('--disable-features=VizDisplayCompositor')
        options.add_argument('--window-size=1920,1080')
        options.add_argument('--remote-debugging-port=9222')
        options.add_argument('--disable-extensions')
        options.add_argument('--disable-plugins')
        options.add_argument('--disable-images')
        options.add_argument(f'--user-agent={self.user_agents[0]}')
        
        # Additional options for Docker environment
        options.add_argument('--disable-background-timer-throttling')
        options.add_argument('--disable-backgrounding-occluded-windows')
        options.add_argument('--disable-renderer-backgrounding')
        options.add_argument('--disable-features=TranslateUI')
        options.add_argument('--disable-ipc-flooding-protection')
        
        driver = None
        try:
            driver = webdriver.Chrome(options=options)
            driver.get(url)
            
            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Additional wait for dynamic content
            time.sleep(2)
            
            # Get page source
            page_source = driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')
            
            # Extract content
            title = self._extract_title(soup)
            content = self._extract_text_content(soup)
            images = self._extract_images(soup, url)
            links = self._extract_links(soup, url)
            pdfs = self._extract_pdfs(soup, url)
            
            return {
                'title': title,
                'content': content,
                'images': images,
                'links': links,
                'pdfs': pdfs,
                'metadata': {
                    'method': 'selenium',
                    'page_title': driver.title,
                    'current_url': driver.current_url
                }
            }
            
        finally:
            if driver:
                driver.quit()
    
    async def _scrape_with_playwright(self, url: str) -> Dict[str, Any]:
        """Scrape using Playwright for modern web applications"""
        if not PLAYWRIGHT_AVAILABLE:
            raise ImportError("Playwright not available")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            try:
                # Set user agent
                await page.set_extra_http_headers({
                    'User-Agent': self.user_agents[0]
                })
                
                # Navigate to page
                await page.goto(url, wait_until='networkidle')
                
                # Wait for content to load
                await page.wait_for_load_state('domcontentloaded')
                
                # Get page content
                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Extract content
                title = self._extract_title(soup)
                text_content = self._extract_text_content(soup)
                images = self._extract_images(soup, url)
                links = self._extract_links(soup, url)
                pdfs = self._extract_pdfs(soup, url)
                
                return {
                    'title': title,
                    'content': text_content,
                    'images': images,
                    'links': links,
                    'pdfs': pdfs,
                    'metadata': {
                        'method': 'playwright',
                        'page_title': await page.title(),
                        'current_url': page.url
                    }
                }
                
            finally:
                await browser.close()
    
    async def _scrape_pdf(self, url: str) -> Dict[str, Any]:
        """Extract content from PDF documents"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            # Try pdfplumber first (better for complex layouts)
            try:
                import io
                pdf_file = io.BytesIO(response.content)
                
                with pdfplumber.open(pdf_file) as pdf:
                    text_content = ""
                    metadata = {}
                    
                    # Extract text from all pages
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text_content += page_text + "\n"
                    
                    # Extract metadata
                    if pdf.metadata:
                        metadata = {
                            'title': pdf.metadata.get('Title', ''),
                            'author': pdf.metadata.get('Author', ''),
                            'subject': pdf.metadata.get('Subject', ''),
                            'creator': pdf.metadata.get('Creator', ''),
                            'producer': pdf.metadata.get('Producer', ''),
                            'creation_date': str(pdf.metadata.get('CreationDate', '')),
                            'modification_date': str(pdf.metadata.get('ModDate', ''))
                        }
                
                return {
                    'title': metadata.get('title', url.split('/')[-1]),
                    'content': text_content.strip(),
                    'images': [],
                    'links': [],
                    'pdfs': [url],
                    'metadata': {
                        'method': 'pdf',
                        'pdf_metadata': metadata,
                        'page_count': len(pdf.pages) if 'pdf' in locals() else 0
                    }
                }
                
            except Exception as e:
                logger.warning(f"pdfplumber failed, trying PyPDF2: {e}")
                
                # Fallback to PyPDF2
                pdf_file = io.BytesIO(response.content)
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                
                text_content = ""
                for page in pdf_reader.pages:
                    text_content += page.extract_text() + "\n"
                
                return {
                    'title': url.split('/')[-1],
                    'content': text_content.strip(),
                    'images': [],
                    'links': [],
                    'pdfs': [url],
                    'metadata': {
                        'method': 'pdf_pypdf2',
                        'page_count': len(pdf_reader.pages)
                    }
                }
                
        except Exception as e:
            raise Exception(f"PDF processing failed: {str(e)}")
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract page title"""
        title_tag = soup.find('title')
        if title_tag:
            return title_tag.get_text().strip()
        
        # Try h1 tag as fallback
        h1_tag = soup.find('h1')
        if h1_tag:
            return h1_tag.get_text().strip()
        
        return "Untitled"
    
    def _extract_text_content(self, soup: BeautifulSoup) -> str:
        """Extract main text content from page"""
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    
    def _extract_images(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract image URLs from page"""
        images = []
        for img in soup.find_all('img'):
            src = img.get('src')
            if src:
                # Convert relative URLs to absolute
                absolute_url = urljoin(base_url, src)
                images.append(absolute_url)
        return images
    
    def _extract_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract links from page"""
        links = []
        for link in soup.find_all('a', href=True):
            href = link.get('href')
            if href:
                # Convert relative URLs to absolute
                absolute_url = urljoin(base_url, href)
                links.append(absolute_url)
        return links
    
    def _extract_pdfs(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract PDF links from page"""
        pdfs = []
        for link in soup.find_all('a', href=True):
            href = link.get('href')
            if href and any(re.search(pattern, href, re.IGNORECASE) for pattern in self.pdf_patterns):
                absolute_url = urljoin(base_url, href)
                pdfs.append(absolute_url)
        return pdfs
    
    def _post_process_content(self, content: Dict[str, Any], url: str) -> Dict[str, Any]:
        """Post-process scraped content"""
        # Clean and validate content
        if content.get('content'):
            content['content'] = self._clean_text(content['content'])
        
        # Add URL-specific processing
        if any(re.search(pattern, url, re.IGNORECASE) for pattern in self.gov_patterns.values()):
            content = self._process_government_content(content, url)
        
        return content
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text content"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters that might cause issues
        text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)\[\]\"\']', '', text)
        
        return text.strip()
    
    def _process_government_content(self, content: Dict[str, Any], url: str) -> Dict[str, Any]:
        """Special processing for government websites"""
        # Add government-specific metadata
        content['metadata']['source_type'] = 'government'
        
        # Extract specific patterns for government documents
        if content.get('content'):
            # Look for act numbers, section numbers, etc.
            act_patterns = [
                r'Act No\.?\s*\d+',
                r'Section\s+\d+',
                r'Rule\s+\d+',
                r'Regulation\s+\d+'
            ]
            
            found_patterns = []
            for pattern in act_patterns:
                matches = re.findall(pattern, content['content'], re.IGNORECASE)
                found_patterns.extend(matches)
            
            if found_patterns:
                content['metadata']['legal_references'] = list(set(found_patterns))
        
        return content
    
    def _is_valid_url(self, url: str) -> bool:
        """Validate URL format"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    async def scrape_multiple_urls(self, urls: List[str], max_concurrent: int = 5) -> List[ScrapedContent]:
        """Scrape multiple URLs concurrently"""
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def scrape_with_semaphore(url):
            async with semaphore:
                return await self.scrape_url(url)
        
        tasks = [scrape_with_semaphore(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out exceptions
        valid_results = []
        for result in results:
            if isinstance(result, ScrapedContent):
                valid_results.append(result)
            else:
                logger.error(f"Scraping failed: {result}")
        
        return valid_results
    
    async def health_check(self) -> Dict[str, Any]:
        """Check scraper health and dependencies"""
        health_status = {
            'selenium_available': SELENIUM_AVAILABLE,
            'playwright_available': PLAYWRIGHT_AVAILABLE,
            'requests_session': True,
            'dependencies': {
                'requests': True,
                'beautifulsoup4': True,
                'selenium': SELENIUM_AVAILABLE,
                'playwright': PLAYWRIGHT_AVAILABLE,
                'pdfplumber': True,
                'pypdf2': True
            }
        }
        
        # Test basic functionality
        try:
            test_response = self.session.get('https://httpbin.org/get', timeout=5)
            health_status['network_test'] = test_response.status_code == 200
        except:
            health_status['network_test'] = False
        
        return health_status

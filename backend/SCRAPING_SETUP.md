# Advanced Web Scraping Backend Setup Guide

This guide will help you set up the advanced web scraping backend with Selenium, Playwright, and PDF processing capabilities.

## Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher (for frontend)
- Chrome/Chromium browser (for Selenium)
- Git

## Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -e .
```

### 2. Install Browser Drivers

#### For Selenium (Chrome/Chromium):
```bash
# Install Chrome/Chromium
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install -y chromium-browser

# macOS (with Homebrew):
brew install --cask google-chrome

# Windows: Download from https://www.google.com/chrome/

# Install ChromeDriver
pip install webdriver-manager
```

#### For Playwright:
```bash
# Install Playwright browsers
playwright install chromium
playwright install-deps
```

### 3. Install Additional Dependencies

```bash
# Install system dependencies for PDF processing
# Ubuntu/Debian:
sudo apt-get install -y poppler-utils

# macOS:
brew install poppler

# Windows: Download poppler from https://poppler.freedesktop.org/
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Scraping Configuration
MAX_CONCURRENT_SCRAPES=5
DEFAULT_TIMEOUT=30
MAX_RETRIES=3

# Browser Configuration
SELENIUM_HEADLESS=true
PLAYWRIGHT_HEADLESS=true

# PDF Processing
PDF_MAX_SIZE_MB=50
PDF_TIMEOUT_SECONDS=60

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=10
```

### 5. Start the Backend Server

```bash
cd backend
python -m backend_app.main
```

The API will be available at `http://localhost:8000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing the Setup

### 1. Test Backend Health

```bash
curl http://localhost:8000/v1/scrape/health
```

Expected response:
```json
{
  "selenium_available": true,
  "playwright_available": true,
  "requests_session": true,
  "dependencies": {
    "requests": true,
    "beautifulsoup4": true,
    "selenium": true,
    "playwright": true,
    "pdfplumber": true,
    "pypdf2": true
  },
  "network_test": true
}
```

### 2. Test Basic Scraping

```bash
curl -X POST http://localhost:8000/v1/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://httpbin.org/html", "method": "requests"}'
```

### 3. Test Government Site Scraping

```bash
curl -X POST http://localhost:8000/v1/scrape/government \
  -H "Content-Type: application/json" \
  -d '{"url": "https://indiacode.nic.in", "site_type": "indiacode"}'
```

## Advanced Configuration

### Selenium Configuration

For production environments, you may want to configure Selenium with additional options:

```python
# In scraper.py, modify the ChromeOptions:
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument('--disable-extensions')
options.add_argument('--no-first-run')
options.add_argument('--disable-default-apps')
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)
```

### Playwright Configuration

For better performance, you can configure Playwright:

```python
# In scraper.py, modify the browser launch:
browser = await p.chromium.launch(
    headless=True,
    args=['--disable-web-security', '--disable-features=VizDisplayCompositor']
)
```

### PDF Processing Configuration

For large PDF files, you may need to adjust memory settings:

```python
# In scraper.py, modify PDF processing:
with pdfplumber.open(pdf_file) as pdf:
    # Process pages in batches for large files
    for i in range(0, len(pdf.pages), 10):
        batch = pdf.pages[i:i+10]
        for page in batch:
            # Process page
```

## Troubleshooting

### Common Issues

1. **Selenium WebDriver not found**
   ```bash
   # Install webdriver-manager
   pip install webdriver-manager
   
   # Or manually download ChromeDriver
   # https://chromedriver.chromium.org/
   ```

2. **Playwright browsers not installed**
   ```bash
   playwright install chromium
   playwright install-deps
   ```

3. **PDF processing fails**
   ```bash
   # Install poppler-utils
   sudo apt-get install poppler-utils  # Ubuntu/Debian
   brew install poppler  # macOS
   ```

4. **Permission denied errors**
   ```bash
   # Make sure the user has permission to run browsers
   sudo chown -R $USER:$USER ~/.cache/
   ```

### Performance Optimization

1. **Increase concurrent scraping**
   ```python
   # In scraper.py
   max_concurrent = 10  # Adjust based on your system
   ```

2. **Optimize browser settings**
   ```python
   # Disable images and CSS for faster scraping
   options.add_argument('--disable-images')
   options.add_argument('--disable-css')
   ```

3. **Use connection pooling**
   ```python
   # In scraper.py, reuse session
   session = requests.Session()
   session.mount('http://', HTTPAdapter(pool_connections=10, pool_maxsize=10))
   ```

## Security Considerations

1. **Rate Limiting**: Implement rate limiting to avoid overwhelming target servers
2. **User-Agent Rotation**: Rotate user agents to avoid detection
3. **Proxy Support**: Add proxy support for large-scale scraping
4. **Input Validation**: Validate all URLs and parameters
5. **Error Handling**: Implement proper error handling and logging

## Monitoring and Logging

1. **Enable detailed logging**
   ```python
   import logging
   logging.basicConfig(level=logging.INFO)
   ```

2. **Monitor scraping performance**
   ```python
   # Track metrics
   - Success rate
   - Average processing time
   - Error types and frequencies
   - Resource usage
   ```

3. **Set up alerts**
   ```python
   # Alert on high error rates or performance issues
   if error_rate > 0.1:
       send_alert("High error rate detected")
   ```

## Production Deployment

1. **Use Docker** for consistent environments
2. **Implement proper logging** with structured logs
3. **Set up monitoring** with Prometheus/Grafana
4. **Use reverse proxy** (nginx) for load balancing
5. **Implement caching** for frequently scraped content
6. **Set up backup** and disaster recovery procedures

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Support

For issues and questions:
1. Check the logs for error messages
2. Verify all dependencies are installed correctly
3. Test with simple URLs first
4. Check network connectivity
5. Review the API documentation

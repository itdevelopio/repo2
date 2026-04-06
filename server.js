/*
================================================================================
                    NEWS ARTICLES SERVER
================================================================================

PURPOSE:
  Serves markdown files from the news_articles folder as JSON.
  Dynamically reads all .md files, parses them, and returns sorted by date.

WHAT IT DOES:
  1. Listens on http://localhost:3000
  2. Serves /get-articles endpoint
  3. Reads all .md files from news_articles folder
  4. Parses markdown: extracts title, description, category
  5. Returns JSON sorted by file modification date (newest first)
  6. Frontend fetches this data and merges with base stories

INSTALLATION:
  This server uses only Node.js built-in modules (no npm packages needed!)
  
USAGE:
  1. Save this file as server.js in repo2 folder
  2. Run: node server.js
  3. Access: http://localhost:3000/get-articles

================================================================================
*/

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = 3000;
const NEWS_ARTICLES_DIR = path.join(__dirname, 'news_articles');

/*
================================================================================
PARSE MARKDOWN FUNCTION
================================================================================
Extracts structured data from markdown files.
Markdown format expected:
  # Title
  First paragraph description...
  More content...
*/
function parseMarkdown(filePath, fileName) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        // Extract title (first # heading)
        let title = 'Untitled Article';
        let description = '';
        let category = 'News';
        
        // Find title
        for (let line of lines) {
            if (line.startsWith('# ')) {
                title = line.replace('# ', '').trim();
                break;
            }
        }
        
        // Extract description (first non-empty paragraph after title)
        let foundTitle = false;
        let paraLines = [];
        for (let line of lines) {
            if (line.startsWith('# ')) {
                foundTitle = true;
                continue;
            }
            if (foundTitle && line.trim() !== '' && !line.startsWith('#')) {
                paraLines.push(line.trim());
                // Limit to first 2 lines of description
                if (paraLines.join(' ').length > 200) break;
            }
        }
        description = paraLines.join(' ').substring(0, 300) + '...';
        
        // Extract category from filename (word before .md)
        const nameParts = fileName.replace('.md', '').split('_');
        if (nameParts.length > 0) {
            category = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
        }
        
        // Get file modification time
        const stats = fs.statSync(filePath);
        
        return {
            title: title,
            description: description,
            category: category,
            source: fileName.replace('.md', '').replace(/_/g, ' '),
            date: stats.mtime.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            timestamp: stats.mtime.getTime(),  // For sorting
            fullContent: content,
            fileName: fileName
        };
    } catch (error) {
        console.error(`Error parsing ${filePath}:`, error);
        return null;
    }
}

/*
================================================================================
HTTP REQUEST HANDLER
================================================================================
Responds to HTTP requests on /get-articles endpoint
Returns JSON with all markdown files sorted by date (newest first)
*/
const server = http.createServer((req, res) => {
    // Set CORS headers to allow frontend to fetch
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Route: GET /get-articles
    if (req.url === '/get-articles' && req.method === 'GET') {
        try {
            // Read all files in news_articles directory
            const files = fs.readdirSync(NEWS_ARTICLES_DIR);
            const mdFiles = files.filter(file => file.endsWith('.md'));
            
            // Parse each markdown file
            const articles = [];
            for (let file of mdFiles) {
                const filePath = path.join(NEWS_ARTICLES_DIR, file);
                const article = parseMarkdown(filePath, file);
                if (article) {
                    articles.push(article);
                }
            }
            
            // Sort by timestamp (newest first)
            articles.sort((a, b) => b.timestamp - a.timestamp);
            
            // Return as JSON
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'success',
                articles: articles,
                count: articles.length
            }));
            
        } catch (error) {
            console.error('Error reading articles:', error);
            res.writeHead(500);
            res.end(JSON.stringify({ 
                status: 'error',
                message: 'Failed to read articles'
            }));
        }
        return;
    }
    
    // Not found response
    res.writeHead(404);
    res.end(JSON.stringify({ 
        status: 'error',
        message: 'Endpoint not found. Use /get-articles'
    }));
});

// Start server
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║              📰 NEWS ARTICLES SERVER RUNNING                   ║
╚════════════════════════════════════════════════════════════════╝

✓ Server running on http://localhost:${PORT}
✓ Endpoint: http://localhost:${PORT}/get-articles
✓ Reading markdown files from: ${NEWS_ARTICLES_DIR}

USAGE:
  - Open http://localhost:3000/get-articles in browser
  - Returns JSON with all markdown files sorted by date
  - Automatically picks up new .md files when added to news_articles folder

To stop: Press Ctrl+C
    `);
});

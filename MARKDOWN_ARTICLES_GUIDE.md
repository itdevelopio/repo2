# 📰 Markdown Articles Integration Guide

## Overview

The **Good News Daily** now automatically loads markdown (.md) articles from the `news_articles/` folder and displays them in the infinite scroll at the **top**, sorted by modification date (newest first).

---

## ⚡ Quick Start

### Step 1: Start the Backend Server

Open a terminal in the `repo2` folder and run:

```bash
node server.js
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════════════╗
║              📰 NEWS ARTICLES SERVER RUNNING                   ║
╚════════════════════════════════════════════════════════════════╝

✓ Server running on http://localhost:3000
✓ Endpoint: http://localhost:3000/get-articles
✓ Reading markdown files from: C:\Users\Marcel\Desktop\Git\repo2\news_articles
```

The server is **running in the background**. Leave this terminal open.

### Step 2: Open Good News Page

Open your browser and navigate to:

```
file:///c:/Users/Marcel/Desktop/Git/repo2/news_articles/good_news.html
```

**What you'll see:**
- Your 3 psychology markdown articles at the top (sorted newest first)
- Each article shows its title, category, description, date
- Infinite scroll continues with generated base articles below
- Smooth fade-in animations as you scroll

---

## 📝 How to Add New Articles

### Adding a New Markdown Article

1. **Create a `.md` file** in `news_articles/` folder

   Example filename:
   ```
   psychology_blog_post_4_anxiety_treatment.md
   ```

2. **Use this markdown format:**

   ```markdown
   # Your Article Title

   First paragraph of your article goes here. This will be used as the 
   description/teaser in the infinite scroll.

   ## Subheading

   More content here...
   ```

3. **Save the file** in `news_articles/` folder

4. **Refresh the page** - new article appears automatically at the top!

### Example Structure

```
repo2/
├── server.js                 (run this to start backend)
├── news_articles/
│   ├── good_news.html        (the infinite scroll page)
│   ├── psychology_blog_post_1_*.md
│   ├── psychology_blog_post_2_*.md
│   ├── psychology_blog_post_3_*.md
│   └── psychology_blog_post_4_*.md  (NEW - automatically detected!)
└── README.md
```

---

## 🔄 How It Works

### Data Flow

```
1. good_news.html loads in browser
                 ↓
2. Calls loadMarkdownArticles() function
                 ↓
3. Fetches http://localhost:3000/get-articles
                 ↓
4. server.js reads all .md files from news_articles/
                 ↓
5. Parses markdown: extracts title, description, category
                 ↓
6. Sorts by file modification date (newest first)
                 ↓
7. Returns JSON array of articles
                 ↓
8. Frontend converts to story objects with emojis
                 ↓
9. Prepends markdown articles to base stories array
                 ↓
10. Displays them first in infinite scroll
                 ↓
11. User scrolls = generates variations of base stories
```

### Server Endpoint

**URL:** `http://localhost:3000/get-articles`

**Returns JSON Like:**
```json
{
  "status": "success",
  "articles": [
    {
      "title": "Psilocybin Shows Promise...",
      "description": "Recent clinical trials show...",
      "category": "Psychology",
      "source": "psychology_blog_post_2_psilocybin_brain_research",
      "date": "Apr 6, 2026",
      "timestamp": 1712435000000
    },
    {
      "title": "AI in Mental Health...",
      "description": "WHO warns about...",
      "category": "Psychology",
      "source": "psychology_blog_post_1_ai_mental_health",
      "date": "Apr 6, 2026",
      "timestamp": 1712434900000
    }
  ],
  "count": 2
}
```

---

## 🎯 Key Features

| Feature | Details |
|---------|----|
| **Auto-Detection** | New .md files are automatically picked up (no code changes needed) |
| **Sorting** | Articles sorted by file modification date (newest first) |
| **Category Detection** | Category extracted from filename (e.g., "psychology_*" → Psychology) |
| **Emoji Assignment** | Emojis assigned based on category |
| **Graceful Fallback** | If server not running, page shows base articles only (doesn't crash) |
| **Infinite Variations** | Base articles generate infinite variations as user scrolls |
| **No npm Required** | Server uses only Node.js built-in modules |

---

## 📊 Article Markdown Format

### Recommended Structure

```markdown
# Article Title

Your opening/teaser paragraph. Keep it concise (first 300 characters 
will be used as the description in the infinite scroll).

## Key Points

- Bullet point 1
- Bullet point 2

## More Details

Longer paragraphs with detailed information.

## Conclusion

Wrap up your thoughts.
```

### What Gets Extracted

| Field | Source | Max Length |
|-------|--------|-----------|
| **Title** | First `# Heading` | Full text |
| **Description** | First paragraph | 300 characters |
| **Category** | Filename (before `_`) | Auto |
| **Date** | File modification date | Auto |
| **Source** | Filename (underscores→spaces) | Full |

---

## 🐛 Troubleshooting

### Issue: "Backend server not available" message

**Solution:**
1. Make sure `node server.js` is running in a terminal
2. Check the terminal output - should see the ASCII art header
3. If not, run `node server.js` again

### Issue: New markdown file not showing up

**Solution:**
1. Make sure .md file is in `news_articles/` folder with `.md` extension
2. Refresh the page (Ctrl+R or Cmd+R)
3. Check browser console (F12) for errors
4. Verify server is running

### Issue: Articles showing at wrong position

**Solution:**
- The system sorts by **file modification date**
- Markdown articles always appear **first** (at top)
- Generated articles (base stories) appear **below** them
- This is by design

### Issue: Server says "Cannot find module"

**Solution:**
- Make sure you're in the `repo2` directory when running `node server.js`
- All required modules are Node.js built-in (no need to npm install)

---

## 🤓 Learning the Code

### Key Functions in good_news.html

```javascript
// Fetch markdown articles from backend
async function loadMarkdownArticles() { ... }

// Assign emoji based on article category
function getCategoryEmoji(category) { ... }

// Generate infinite variations of base stories
function generateStoryVariations(index, variation) { ... }

// Create HTML card element from story object
function createNewsCard(newsItem, delay) { ... }

// Detect scroll and load more articles
window.addEventListener('scroll', () => { ... })
```

### Key Features in server.js

```javascript
// Parse markdown file: extract title, description, category
function parseMarkdown(filePath, fileName) { ... }

// HTTP request handler for /get-articles endpoint
const server = http.createServer((req, res) => { ... })
```

---

## 📋 File Organization

```
repo2/
├── server.js
│   └── Reads .md files, returns JSON
├── news_articles/
│   ├── good_news.html
│   │   └── Frontend: fetches & displays articles
│   ├── psychology_blog_post_1_ai_mental_health.md
│   ├── psychology_blog_post_2_psilocybin_brain_research.md
│   ├── psychology_blog_post_3_fear_memory_ptsd.md
│   └── [ADD NEW .MD FILES HERE]
└── README.md
```

---

## 🚀 Next Steps

1. ✅ Start server: `node server.js`
2. ✅ Open `good_news.html` in browser
3. ✅ Verify markdown articles appear at top
4. ✅ Add new .md files to test auto-detection
5. ✅ Scroll down to see infinite generated articles

---

## 💡 Tips

- **File naming matters**: Use descriptive names like `category_title_keywords.md`
- **First paragraph**: Keep it engaging - it becomes the teaser
- **Refresh page**: After adding new .md files, refresh browser to reload
- **Keep server running**: Server must run in background for articles to load
- **No code changes needed**: Just add .md files and they appear!

---

## ✨ Example: Adding a New Article

Let's add an article about climate change:

**File:** `climate_change_carbon_capture.md`

```markdown
# Carbon Capture Technology Reaches New Milestone

Researchers have successfully demonstrated a cost-effective method for 
capturing carbon dioxide directly from the atmosphere. This breakthrough 
could accelerate efforts to reverse climate change.

## The Challenge

Climate scientists have long sought affordable ways to remove CO2 from 
the air at scale. Previous methods were too expensive.

## The Breakthrough

Scientists at leading universities developed a new material that can 
absorb CO2 at room temperature, making it practical for deployment.

## What's Next

Companies are already planning commercial capture facilities that could 
operate at scale within 2 years.
```

**Result:**
- ✅ Appears at top of infinite scroll
- ✅ Title: "Carbon Capture Technology Reaches New Milestone"
- ✅ Category: "Climate" (auto-detected from filename)
- ✅ Emoji: 🌍 (climate category emoji)
- ✅ Date: Today's date (file modification time)
- ✅ Description: First paragraph truncated to 300 chars

---

## 🎓 What You're Learning

By using this system, you're learning:

✓ How servers handle file I/O
✓ How to parse structured text (markdown)
✓ How async/await fetching works
✓ How to sort data by timestamps
✓ How to integrate data sources
✓ Graceful error/fallback handling
✓ Real-world pagination patterns
✓ Using Node.js built-in modules

---

**Happy news writing! 🎉**

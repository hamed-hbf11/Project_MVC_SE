const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_DIR = path.join(__dirname, 'storage', 'blog-db');
const DB_PATH = path.join(DB_DIR, 'blog.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(DB_DIR)) {
            fs.mkdirSync(DB_DIR, { recursive: true });
        }
        const sqlite3 = require('sqlite3').verbose();

        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
            } else {
                console.log('📊 Connected to SQLite database');

                // Create posts table if it doesn't exist
                db.run(`
                    CREATE TABLE IF NOT EXISTS posts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        content TEXT NOT NULL,
                        author TEXT DEFAULT 'Anonymous',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                    `, (err) => {
                    if (err) {
                        console.error('Error creating table:', err);
                        reject(err);
                    } else {
                        console.log('📋 Posts table ready');

                        // Check if we need to add initial data
                        db.get('SELECT COUNT(*) as count FROM posts', (err, row) => {
                            if (err) {
                                console.error('Error counting posts:', err);
                                reject(err);
                            } else if (row.count === 0) {
                                // Add initial data
                                const initialPost = {
                                    title: 'Welcome to My Blog',
                                    content: 'This is my first blog post! I\'m excited to share my thoughts and experiences with you.',
                                    author: 'Blog Owner'
                                };

                                db.run(`
                                    INSERT INTO posts (title, content, author, created_at, updated_at)
                                    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                                `, [initialPost.title, initialPost.content, initialPost.author], (err) => {
                                    if (err) {
                                        console.error('Error inserting initial data:', err);
                                        reject(err);
                                    } else {
                                        console.log('📝 Added initial blog post');
                                        resolve(db);
                                    }
                                });
                            } else {
                                resolve(db);
                            }
                        });
                    }
                });
            }
        });
    });
}

// DB Instance
let db;

// Get all the posts
app.get('/api/posts', async (req, res) => {
    console.log('📖 GET /api/posts - Fetching all blog posts');

    db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
        } else {
            // Convert SQLite format to match original JSON format
            const posts = rows.map(row => ({
                id: row.id,
                title: row.title,
                content: row.content,
                author: row.author,
                createdAt: new Date(row.created_at).toISOString(),
                updatedAt: new Date(row.updated_at).toISOString()
            }));
            res.json(posts);
        }
    });
});

// POST create a new blog post
app.post('/api/posts', (req, res) => {
    console.log('✍️ POST /api/posts - Creating new blog post');

    const { title, content, author } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const sql = `
        INSERT INTO posts (title, content, author, created_at, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    db.run(sql, [title, content, author || 'Anonymous'], function (err) {
        if (err) {
            console.error('Error creating post:', err);
            res.status(500).json({ error: 'Failed to create post' });
        } else {
            const postId = this.lastID;
            console.log('✅ Post created with ID:', postId);

            // Fetch the created post to return complete data
            db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, row) => {
                if (err) {
                    console.error('Error fetching created post:', err);
                    res.status(500).json({ error: 'Failed to fetch created post' });
                } else {
                    res.status(201).json({
                        id: row.id,
                        title: row.title,
                        content: row.content,
                        author: row.author,
                        createdAt: new Date(row.created_at).toISOString(),
                        updatedAt: new Date(row.updated_at).toISOString()
                    });
                }
            });
        }
    });
});

// PUT update a blog post
app.put('/api/posts/:id', (req, res) => {
    console.log('✏️ PUT /api/posts/:id - Updating blog post');

    const { id } = req.params;
    const { title, content, author } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const sql = `
        UPDATE posts
        SET title = ?, content = ?, author = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(sql, [title, content, author || 'Anonymous', id], function (err) {
        if (err) {
            console.error('Error updating post:', err);
            res.status(500).json({ error: 'Failed to update post' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
                if (err) {
                    console.error('Error fetching updated post:', err);
                    res.status(500).json({ error: 'Failed to fetch updated post' });
                } else {
                    res.json({
                        id: row.id,
                        title: row.title,
                        content: row.content,
                        author: row.author,
                        createdAt: new Date(row.created_at).toISOString(),
                        updatedAt: new Date(row.updated_at).toISOString()
                    });
                }
            });
        }
    });
});

// DELETE a blog post
app.delete('/api/posts/:id', (req, res) => {
    console.log('🗑️ DELETE /api/posts/:id - Deleting blog post');

    const { id } = req.params;

    db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Error deleting post:', err);
            res.status(500).json({ error: 'Failed to delete post' });
        } else if (this.changes === 0) {
            console.log('❌ Post not found with ID:', id);
            res.status(404).json({ error: 'Post not found' });
        } else {
            console.log('✅ Post deleted with ID:', id);
            res.json({
                message: 'Post deleted successfully',
                id: parseInt(id)
            });
        }
    });
});

// Initialize and start server
async function startServer() {
    try {
        db = await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log('📚 Available endpoints:');
            console.log('   GET    /api/posts');
            console.log('   GET    /api/posts/:id');
            console.log('   POST   /api/posts');
            console.log('   PUT    /api/posts/:id');
            console.log('   DELETE /api/posts/:id');
            console.log('');
            console.log('🌐 Client application: https://mvc.liara.run:' + PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('📊 Database connection closed');
            }
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

// Start the server
startServer();
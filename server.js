const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { resolve } = require('dns');
const { rejects } = require('assert');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'data', 'blog.db');

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function initializeDatabase() {
    return new Promise((resolve, rejects) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                rejects(err);
            } else {
                console.log('Connect to SQLite database');

                //create posts table if it dosen't exist
                db.run(`
                    CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREAMENT,
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
                        console.log('Posts table ready');

                        //Check if we need to add initial data
                        db.get('SELECT COUNT(*) as count FROM posts', (err, row) => {
                            if (err) {
                                console.error('Error counting posts:', err);
                                reject(err);
                            } else if (row.count == 0) {
                                // Add initial data
                                const initialPost = {
                                    title: 'Welcome to my Blog',
                                    content: 'This is my first blog post! I\'n excited to share my thoughts and experiences with you.',
                                    author: 'Blog Owner'
                                };

                                db.run(`
                                         INSERT INTO posts(title, content, author, created_at, updated_at)
                                         VALUES(?,?,?,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
                                        `, [initialPost.title, initialPost.content, initialPost.author], (err) => {
                                    if (err) {
                                        console.error('Error inserting initial data', err);
                                        reject(err);
                                    } else {
                                        console.log('Added initial blog post');
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

//DB Instance
let db;

//Get all the Posts 
app.get('/api/posts', async (req, res) => {
    console.log('Get /api/posts - Fetching all blog posts');

    db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            console.error('Error Fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
        } else {
            //Convert SQLite format to match original JSON format
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

//Post create a new blog post 

//Put update a blog post 

//DELETE a blog post 

//initialize and start server 
async function startServer() {
    try {
        db = await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Blog MVC REST API Server running on http://localhost:${PORT}`);
            console.log('Available endpoints:');
            console.log('   GET     /api/posts');
            console.log('   GET     /api/posts/:id');
            console.log('   POST     /api/posts');
            console.log('   PUT     /api/posts/:id');
            console.log('   DELETE  /api/posts/:id');
            console.log('');
            console.log('Client application: http://localhost:' + PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

process.on('SIGINT' , ()=>{
    console.log('\n Shutting down server...');
    if(db){
        db.close((err)=>{
            if(err){
                console.error('Error closing database:', err);
            }else{
                console.log('Database connection closed');
            }
            process.exit(0);
        });
    }else{
        process.exit(0);
    }
});

//Start the server 
startServer();
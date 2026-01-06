# 📝 Blog MVC - RESTful API Demo

A full-stack blog application built with **vanilla JavaScript** following the **MVC (Model-View-Controller)** architecture pattern. This project demonstrates clean separation of concerns, RESTful API design, and modern web development practices.

## ✨ Features

- 🏗️ **MVC Architecture** - Clean separation of Model, View, and Controller
- 🔄 **Full CRUD Operations** - Create, Read, Update, Delete blog posts
- 🎨 **Dark/Light Theme** - Beautiful UI with theme switching
- 📱 **Responsive Design** - Works seamlessly on all devices
- 💾 **SQLite Database** - Lightweight and persistent data storage
- ⚡ **RESTful API** - Standard HTTP methods and endpoints
- 🔍 **Form Validation** - Client and server-side validation
- 📊 **Observer Pattern** - Reactive updates between components
- 🎭 **Modal System** - Edit posts in a clean modal interface
- 🔔 **Notifications** - Success, error, and warning messages

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/blog-mvc.git
cd blog-mvc
```

1. **Install dependencies**

```bash
npm install
```

1. **Create data directory**

```bash
mkdir data
```

1. **Start the server**

```bash
npm start
```

1. **Open your browser**

```
http://localhost:3001
```

## 📁 Project Structure

```
blog-mvc/
├── public/
│   ├── css/
│   │   └── style.css           # Application styles with dark mode
│   ├── js/
│   │   ├── model.js            # Data layer (API calls, validation)
│   │   ├── view.js             # Presentation layer (DOM manipulation)
│   │   ├── controller.js       # Logic layer (coordination)
│   │   └── app.js              # Application initialization
│   └── index.html              # Main HTML file
├── data/
│   └── blog.db                 # SQLite database (auto-generated)
├── server.js                   # Express.js REST API server
├── package.json
└── README.md
```

## 🏛️ Architecture

### MVC Pattern

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│    MODEL    │◄─────┤  CONTROLLER  ├─────►│    VIEW     │
│             │      │              │      │             │
│ - Data      │      │ - Logic      │      │ - UI        │
│ - API calls │      │ - Events     │      │ - Rendering │
│ - Validation│      │ - Flow       │      │ - Forms     │
└─────────────┘      └──────────────┘      └─────────────┘
```

### Observer Pattern

The application uses the Observer pattern for reactive updates:

- Model notifies observers when data changes
- View notifies observers when user interactions occur
- Controller coordinates between Model and View

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | Get all blog posts |
| `GET` | `/api/posts/:id` | Get single post by ID |
| `POST` | `/api/posts` | Create new post |
| `PUT` | `/api/posts/:id` | Update existing post |
| `DELETE` | `/api/posts/:id` | Delete post |

### Example Request/Response

**Create Post:**

```javascript
// POST /api/posts
{
  "title": "My First Post",
  "content": "This is the content of my post",
  "author": "John Doe"
}

// Response (201 Created)
{
  "id": 1,
  "title": "My First Post",
  "content": "This is the content of my post",
  "author": "John Doe",
  "createdAt": "2024-01-06T10:30:00.000Z",
  "updatedAt": "2024-01-06T10:30:00.000Z"
}
```

## 🎨 Theme Support

The application includes a beautiful dark/light theme system:

- Auto-detects system preference
- Manual toggle button
- Smooth transitions
- Persistent across sessions (in-memory)

## 🔧 Technologies Used

### Frontend

- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS3** - Modern CSS with variables and animations
- **HTML5** - Semantic markup

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-Origin Resource Sharing

## 📚 Key Concepts Demonstrated

1. **MVC Architecture**
   - Clear separation of concerns
   - Maintainable and scalable code structure

2. **Observer Pattern**
   - Loose coupling between components
   - Reactive data flow

3. **RESTful API Design**
   - Standard HTTP methods
   - Proper status codes
   - JSON data format

4. **Error Handling**
   - Try-catch blocks
   - User-friendly error messages
   - Validation feedback

5. **Async/Await**
   - Modern asynchronous JavaScript
   - Clean promise handling

## 🔍 Validation Rules

### Post Validation

- **Title**: Required, minimum 3 characters
- **Content**: Required, minimum 10 characters
- **Author**: Optional, defaults to "Anonymous"

## 🛠️ Development

### Available Scripts

```bash
# Start the server
npm start

# Start with auto-reload (if nodemon installed)
npm run dev

# Check Node version
node --version
```

### Database Schema

```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT DEFAULT 'Anonymous',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 👤 Author

**Your Name**

- GitHub: [@Hamed_HBF](https://github.com/hamed-hbf11)
- Email: basirifarhamed@gmail.com

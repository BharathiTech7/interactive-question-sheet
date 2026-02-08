# 🚀 Interactive Question Sheet

An **interactive, drag-and-drop question tracking system** inspired by platforms like **Codolio**.  
Built to help students **organize, practice, and track progress** across DSA topics with a clean and modern UI.

---

## 🌐 Live Links

- **Frontend**: https://interactive-question-sheet-six.vercel.app/
- **Backend API**: https://iqs-backend.onrender.com

---

## ✨ Features

- 🧩 Topic → Sub-topic → Questions hierarchy  
- 🎯 Mark questions as completed  
- 📊 Automatic progress tracking per topic  
- 🧲 Drag & Drop reordering:
  - Topics  
  - Sub-topics  
  - Questions  
- 🌗 Light / Dark theme toggle (manual theme system)  
- 🔗 Add problem links (LeetCode, etc.)  
- ⚡ Fast and responsive UI  

---

## 🛠️ Tech Stack

### Frontend
- React  
- Zustand (state management)  
- Tailwind CSS  
- Manual CSS variables for theming  
- @dnd-kit (drag & drop)  
- **Deployment**: Vercel  

### Backend
- Node.js  
- Express.js  
- CORS  
- In-memory data storage (no database)  
- **Deployment**: Render  

---

## 🔌 API Endpoints

### Get Question Sheet
GET /api/sheet


### Update Question Sheet
POST /api/sheet


---

## 🧠 How It Works

- Backend serves the question sheet using REST APIs  
- Frontend fetches and manages data using **Zustand**  
- Drag & drop updates state instantly  
- Theme toggle switches global CSS variables  
- Progress updates automatically based on completed questions  

---

## 🚧 Current Limitations

- No database (data resets when backend restarts)  
- Single-user system  
- No authentication yet  

---

## 🚀 Future Enhancements

- Database integration (MongoDB / PostgreSQL)  
- User authentication  
- Cloud sync for progress  
- Analytics dashboard  
- Mobile-first optimization  

---

## 🧑‍💻 Author

**Bharathi Reddy**  
GitHub: https://github.com/BharathiTech7  

---

## ❤️ Acknowledgements

Inspired by:
- Codolio  
- Striver SDE Sheet  
- Modern DSA practice platforms

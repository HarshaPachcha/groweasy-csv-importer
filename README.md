# 🚀 GrowEasy AI CSV Importer

An AI-powered CSV Importer that intelligently maps CSV columns to CRM fields using **Google Gemini AI**. Users can upload a CSV, preview data, edit AI-generated mappings, and import transformed CRM-ready records.

---

## ✨ Features

- 📤 Upload CSV files
- 👀 CSV Preview
- 🤖 AI-powered CRM Field Mapping (Gemini AI)
- ✏️ Editable Field Mapping
- 📥 Import CRM Data
- 📊 Import Success Dashboard
- 📄 Download Imported Data as CSV
- 📑 Download Imported Data as JSON
- 🔔 Toast Notifications
- 🔄 Import Another CSV
- 📱 Responsive Modern UI

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- Multer
- csv-parser

### AI
- Google Gemini API

---

## 📂 Project Structure

```
groweasy-csv-importer/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── Backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── server.js
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone <your-github-url>
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside **Backend**.

Example:

```env
GEMINI_API_KEY=YOUR_API_KEY
PORT=5000
```

---

## 📋 Workflow

1. Upload CSV
2. Preview CSV
3. AI detects CRM fields
4. Edit mappings (optional)
5. Import data
6. View Success Dashboard
7. Download CSV / JSON
8. Import another CSV

---
---

## 🔄 Application Workflow

```text
Upload CSV
      │
      ▼
CSV Preview
      │
      ▼
AI Field Mapping (Gemini AI)
      │
      ▼
Edit Mapping (Optional)
      │
      ▼
Import CRM Data
      │
      ▼
Success Dashboard
      │
      ▼
Download JSON / CSV
      │
      ▼
Import Another CSV
```
---

## 🌟 Highlights

- AI-powered CRM field mapping using Google Gemini
- Smart CSV preview before import
- Editable AI suggestions
- Download imported data in JSON and CSV
- Modern responsive UI
- Toast notifications for user feedback
- Drag-and-drop CSV upload
- Professional dashboard after import

---

## 🚀 Future Improvements

- User Authentication
- Import History
- Database Integration (MongoDB/PostgreSQL)
- Multiple CRM Support
- Bulk Import Validation
- Dark Mode
- User Roles & Permissions
- Audit Logs
- Docker Support
---

## 📸 Screenshots

### Upload Page

![Upload Page](screenshots/upload.png)

### CSV Preview

![CSV Preview](screenshots/preview.png)

### AI Field Mapping

![AI Field Mapping](screenshots/mapping.png)

### Success Dashboard

![Success Dashboard](screenshots/success.png)


## 📄 License

This project was developed as part of the GrowEasy AI CSV Importer assignment for educational and demonstration purposes.

## 👨‍💻 Author

**Harshavardhan Pachcha**

M.Sc Data Science

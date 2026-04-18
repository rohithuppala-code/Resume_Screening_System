# Resume Screening System

> AI-powered resume screening and ranking system using Natural Language Processing and Machine Learning

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Overview

An intelligent resume screening system that automatically analyzes and ranks candidate resumes against job descriptions using advanced NLP techniques. The system extracts key information, calculates semantic similarity, and provides detailed insights to streamline the recruitment process.

### Key Features

- 🤖 **NLP-Powered Analysis** - spaCy-based entity recognition and text processing
- 📊 **Intelligent Ranking** - TF-IDF vectorization with cosine similarity scoring
- 🎯 **Match Scoring** - 0-100% compatibility scores with detailed breakdowns
- 📄 **Multi-Format Support** - PDF and TXT file processing
- ⚡ **Real-Time Processing** - Instant results with comprehensive analytics
- 🎨 **Modern UI** - Responsive React interface with Tailwind CSS
- 🔍 **Entity Extraction** - Automatic identification of skills, companies, and education

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Frontend (Vite)                        │   │
│  │  • Landing Page  • Upload Interface  • Results Display   │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST API
                             │ (JSON)
┌────────────────────────────▼────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 Flask REST API                            │   │
│  │  • /api/screen  • /api/health  • /api/analyze-resume    │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      PROCESSING LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              NLP Processor Module                         │   │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐    │   │
│  │  │   spaCy    │  │  PyPDF2    │  │  scikit-learn   │    │   │
│  │  │    NER     │  │  Extractor │  │   TF-IDF/Cosine │    │   │
│  │  └────────────┘  └────────────┘  └─────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌──────────────┐
│     User     │
└──────┬───────┘
       │ 1. Upload Resumes + Job Description
       ▼
┌─────────────────────────────────────────┐
│         React Frontend                   │
│  • Validate inputs                       │
│  • Create FormData                       │
└──────┬──────────────────────────────────┘
       │ 2. POST /api/screen
       │    (multipart/form-data)
       ▼
┌─────────────────────────────────────────┐
│         Flask Backend                    │
│  • Validate files & job description      │
│  • Extract text from PDFs                │
└──────┬──────────────────────────────────┘
       │ 3. Process each resume
       ▼
┌─────────────────────────────────────────┐
│       NLP Processor                      │
│  ┌───────────────────────────────────┐  │
│  │ 4. Text Extraction & Cleaning     │  │
│  │    • Remove special characters    │  │
│  │    • Normalize whitespace         │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 5. Entity Recognition (spaCy)     │  │
│  │    • Extract SKILL entities       │  │
│  │    • Extract ORG (companies)      │  │
│  │    • Extract education info       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 6. TF-IDF Vectorization           │  │
│  │    • Convert text to vectors      │  │
│  │    • Calculate cosine similarity  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 7. Skill Matching                 │  │
│  │    • Compare extracted skills     │  │
│  │    • Calculate skill overlap      │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 8. Score Calculation              │  │
│  │    Score = (TF-IDF × 0.7) +       │  │
│  │            (Skill Match × 0.3)    │  │
│  └───────────────────────────────────┘  │
└──────┬──────────────────────────────────┘
       │ 9. Ranked results
       ▼
┌─────────────────────────────────────────┐
│         Flask Backend                    │
│  • Sort by score (descending)            │
│  • Format response JSON                  │
└──────┬──────────────────────────────────┘
       │ 10. JSON Response
       ▼
┌─────────────────────────────────────────┐
│         React Frontend                   │
│  • Display ranked results                │
│  • Show match percentages                │
│  • Render extracted entities             │
└──────┬──────────────────────────────────┘
       │ 11. Visual results
       ▼
┌──────────────┐
│     User     │
└──────────────┘
```

### Scoring Algorithm Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SCORING ALGORITHM                         │
└─────────────────────────────────────────────────────────────┘

Input: Resume Text + Job Description
   │
   ├─────────────────────────────────────┬──────────────────────────────┐
   │                                     │                              │
   ▼                                     ▼                              ▼
┌──────────────────┐          ┌──────────────────┐         ┌──────────────────┐
│  TF-IDF Branch   │          │  Skill Branch    │         │  Entity Branch   │
│  (70% weight)    │          │  (30% weight)    │         │  (Informational) │
└────────┬─────────┘          └────────┬─────────┘         └────────┬─────────┘
         │                              │                            │
         │ 1. Vectorize texts           │ 1. Extract skills          │ 1. Extract entities
         │ 2. Calculate cosine          │ 2. Compare overlap         │ 2. Categorize
         │    similarity                │ 3. Calculate ratio         │    (SKILL, ORG, etc.)
         │                              │                            │
         ▼                              ▼                            ▼
    TF-IDF Score                   Skill Score              Entity Metadata
    (0.0 - 1.0)                    (0.0 - 1.0)              (for display)
         │                              │                            │
         └──────────────┬───────────────┘                            │
                        │                                            │
                        ▼                                            │
              ┌──────────────────┐                                  │
              │  Final Score     │                                  │
              │  = (TF-IDF×0.7)  │                                  │
              │    + (Skill×0.3) │                                  │
              └────────┬─────────┘                                  │
                       │                                            │
                       ▼                                            │
              ┌──────────────────┐                                  │
              │  Convert to %    │                                  │
              │  (Score × 100)   │                                  │
              └────────┬─────────┘                                  │
                       │                                            │
                       └────────────────┬───────────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │  Ranked Result   │
                              │  • Score: 85%    │
                              │  • Entities      │
                              │  • Metadata      │
                              └──────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Core language |
| **Flask** | 3.0.0 | REST API framework |
| **Flask-CORS** | 4.0.0 | Cross-origin resource sharing |
| **spaCy** | 3.7.2 | NLP and entity recognition |
| **scikit-learn** | 1.3.2 | TF-IDF vectorization and similarity |
| **PyPDF2** | 3.0.1 | PDF text extraction |
| **NumPy** | 1.24.3 | Numerical computations |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.4 | UI framework |
| **Vite** | 8.0.4 | Build tool and dev server |
| **Tailwind CSS** | 3.4.19 | Utility-first CSS framework |
| **PostCSS** | 8.5.9 | CSS processing |
| **ESLint** | 9.39.4 | Code linting |

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.8 or higher
- **Node.js** 16 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-screening-system
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   
   This will install all required packages including the spaCy language model.

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   
   Create or verify `.env.local` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

#### Start Backend Server

```bash
cd backend
python app.py
```

Expected output:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

#### Start Frontend Development Server

Open a new terminal:

```bash
npm run dev
```

Expected output:
```
VITE v8.0.4 ready in XXX ms
➜  Local:   http://localhost:5173/
```

#### Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## 📖 Usage Guide

### Step 1: Enter Job Description
- Navigate to the screening interface
- Paste or type the job description in the left panel
- Include key requirements, skills, and qualifications

### Step 2: Upload Resumes
- Click the upload area or drag and drop files
- Supported formats: PDF, TXT
- Multiple files can be uploaded simultaneously
- Maximum file size: 16MB per file

### Step 3: Screen Resumes
- Click the "Screen Resumes" button
- The system will process all resumes
- Processing time: ~200-500ms per resume

### Step 4: Review Results
- Resumes are ranked by match percentage (highest first)
- View detailed information for each candidate:
  - **Match Score**: 0-100% compatibility
  - **Skills**: Extracted technical and soft skills
  - **Companies**: Previous employers
  - **Education**: Academic background
- Click on individual results to expand details

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-18T10:30:00.000Z"
}
```

#### 2. Screen Resumes
```http
POST /api/screen
Content-Type: multipart/form-data
```

**Request Parameters:**
- `jobDescription` (string, required): Job description text
- `resumes` (file[], required): Array of resume files (PDF or TXT)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "rank": 1,
      "name": "john_doe_resume.pdf",
      "score": 0.85,
      "match_percentage": 85,
      "entities": {
        "SKILL": ["Python", "Flask", "React", "Machine Learning"],
        "ORG": ["Google", "Microsoft"],
        "EDUCATION": ["Stanford University", "BS Computer Science"]
      },
      "word_count": 450,
      "length": 2800
    }
  ],
  "job_description": "Senior Python Developer with...",
  "total_resumes": 5,
  "timestamp": "2026-04-18T10:30:00.000Z"
}
```

#### 3. Analyze Single Resume
```http
POST /api/analyze-resume
Content-Type: multipart/form-data
```

**Request Parameters:**
- `resume` (file, required): Resume file (PDF or TXT)

**Response:**
```json
{
  "success": true,
  "entities": {
    "SKILL": ["Python", "JavaScript"],
    "ORG": ["Google"],
    "EDUCATION": ["MIT"]
  },
  "word_count": 450,
  "length": 2800
}
```

#### 4. Extract Job Keywords
```http
POST /api/job-keywords
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobDescription": "Senior Python Developer with 5+ years..."
}
```

**Response:**
```json
{
  "success": true,
  "entities": {
    "SKILL": ["Python", "Django"],
    "EXPERIENCE": ["5+ years"]
  },
  "requirements": ["require", "experience", "skill"],
  "word_count": 120
}
```

---

## 📁 Project Structure

```
resume-screening-system/
│
├── backend/
│   ├── app.py                    # Flask application and API routes
│   ├── nlp_processor.py          # NLP processing and ranking logic
│   ├── models/                   # ML models (if any)
│   ├── uploads/                  # Temporary file storage
│   └── __pycache__/              # Python cache
│
├── src/
│   ├── components/
│   │   ├── Header.jsx            # Application header
│   │   ├── Landing.jsx           # Landing page
│   │   ├── ScreeningInterface.jsx # Resume upload interface
│   │   └── ResultsDisplay.jsx    # Results visualization
│   ├── assets/                   # Images and static assets
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # Application styles
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
│
├── public/
│   ├── favicon.svg               # Favicon
│   └── icons.svg                 # Icon sprites
│
├── Resumes/                      # Sample resumes for testing
│
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Node.js dependencies
├── requirements.txt              # Python dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint configuration
└── README.md                     # This file
```

---

## ⚙️ Configuration

### Backend Configuration

**Port Configuration** (`backend/app.py`):
```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

**File Upload Limits** (`backend/app.py`):
```python
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
ALLOWED_EXTENSIONS = {'pdf', 'txt'}
```

### Frontend Configuration

**API URL** (`.env.local`):
```env
VITE_API_URL=http://localhost:5000
```

**Vite Configuration** (`vite.config.js`):
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

---

## 🧪 Testing

### Manual Testing

1. Start both backend and frontend servers
2. Navigate to http://localhost:5173
3. Use sample resumes from the `Resumes/` directory
4. Test with various job descriptions

### Sample Job Description

```
Senior Python Developer

Requirements:
- 5+ years of Python development experience
- Strong knowledge of Flask and Django frameworks
- Experience with React and modern frontend technologies
- Machine learning and NLP experience preferred
- Bachelor's degree in Computer Science or related field
```

### Expected Behavior

- Resumes with matching skills should rank higher
- Match percentages should reflect similarity
- Entities should be correctly extracted and categorized
- Results should display within 1-2 seconds

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Module not found** | Run `pip install -r requirements.txt` |
| **Port 5000 already in use** | Change port in `backend/app.py` and update `.env.local` |
| **CORS errors** | Verify `VITE_API_URL` matches backend URL |
| **npm install fails** | Delete `node_modules` and `package-lock.json`, then run `npm install` |
| **spaCy model not found** | Run `python -m spacy download en_core_web_sm` |
| **PDF extraction fails** | Ensure PDF is not encrypted or corrupted |

### Debug Mode

Enable detailed logging in Flask:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

Check browser console for frontend errors (F12 in most browsers).

---

## 📊 Performance Metrics

- **Processing Speed**: 200-500ms per resume
- **Accuracy**: Depends on resume quality and job description clarity
- **Supported File Size**: Up to 16MB per file
- **Concurrent Processing**: Sequential processing of multiple resumes
- **Supported Formats**: PDF, TXT

---

## 🔒 Security Considerations

- File uploads are validated for allowed extensions
- Filenames are sanitized using `secure_filename()`
- Maximum file size limits prevent DoS attacks
- CORS is configured for specific origins
- No sensitive data is stored permanently

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **spaCy** - Industrial-strength NLP library
- **scikit-learn** - Machine learning tools
- **React** - UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Flask** - Lightweight web framework

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ using Python, React, and AI**

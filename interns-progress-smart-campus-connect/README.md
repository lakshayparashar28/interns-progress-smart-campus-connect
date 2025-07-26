# Smart Campus Connect

A student marketplace platform built with Flask and React that enables students to buy, sell, or give away items within their college network.

## Features

- User authentication and profile management
- Item listings with images and categories
- Advanced search and filtering
- AI-powered recommendations using Google's Gemini
- Natural language search capabilities
- Real-time availability tracking

## Setup

### Backend (Flask)

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `.env`

4. Run the Flask application:
```bash
python backend/run.py
```

### Frontend (React)

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Environment Variables

Create a `.env` file with the following variables:
```
GEMINI_API_KEY=your-gemini-api-key
```

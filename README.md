# Team Accountability Tracker

A fullstack web application for tracking team tasks and accountability. Built with React, FastAPI, and Supabase.

## Tech Stack

- Frontend: React 19 + Vite
- Backend: FastAPI (Python)
- Database: Supabase (PostgreSQL)

## Setup Instructions

### 1. Set Up Supabase Database

Create a free Supabase account and project at https://supabase.com

Run this SQL in the Supabase SQL Editor:

```sql
-- Run this in your Supabase SQL Editor to create the tasks table
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Enable Row Level Security (RLS) for public access
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read tasks
CREATE POLICY "Allow public read access" ON tasks
    FOR SELECT
    TO public
    USING (true);

-- Policy to allow anyone to insert tasks
CREATE POLICY "Allow public insert access" ON tasks
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy to allow anyone to update tasks
CREATE POLICY "Allow public update access" ON tasks
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Policy to allow anyone to delete tasks
CREATE POLICY "Allow public delete access" ON tasks
    FOR DELETE
    TO public
    USING (true);
```

Get your Supabase credentials:
1. Go to Project Settings in Supabase
2. Click API tab
3. Copy the Project URL and anon public key

### 2. Set Up Backend

Navigate to the backend folder:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create a .env file in the backend folder:

```bash
SUPABASE_URL=your_project_url_here
SUPABASE_KEY=your_anon_key_here
```

Replace the values with your actual Supabase credentials from step 1.

Start the backend server:

```bash
uvicorn main:app --reload --port 8000
```

The backend will run at http://localhost:8000

You can test it by visiting http://localhost:8000/docs to see the API documentation.

### 3. Set Up Frontend

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install Node dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run at http://localhost:5173

Open http://localhost:5173 in your browser to use the app.

## Running the Application

You need both servers running at the same time.

Terminal 1 (Backend):
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Features

- Create tasks with title, assignee, and due date
- Mark tasks as complete or incomplete
- Delete tasks
- View team member statistics and completion rates
- Filter tasks by team member
- Overdue task indicators

## API Endpoints

- GET /tasks - Get all tasks
- POST /tasks - Create a new task
- PATCH /tasks/{id} - Update task completion status
- DELETE /tasks/{id} - Delete a task
- GET /stats - Get team statistics
- GET /team-members - Get list of team members


## Project Structure

```
fullstack/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main app component
│   │   └── App.css          # Styles
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
└── docs/                    # Documentation
```


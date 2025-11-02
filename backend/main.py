from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI()

# CORS - allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase connection
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Data models
class Task(BaseModel):
    title: str
    assigned_to: str
    due_date: str

class TaskUpdate(BaseModel):
    completed: bool

@app.get("/")
def read_root():
    return {"message": "Team Accountability Tracker API"}

@app.get("/tasks")
def get_tasks():
    """Get all tasks"""
    try:
        response = supabase.table("tasks").select("*").order("due_date", desc=False).execute()
        return {"tasks": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks")
def create_task(task: Task):
    """Create a new task"""
    try:
        response = supabase.table("tasks").insert({
            "title": task.title,
            "assigned_to": task.assigned_to,
            "due_date": task.due_date,
            "completed": False
        }).execute()
        return {"message": "Task created", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/tasks/{task_id}")
def update_task(task_id: int, task_update: TaskUpdate):
    """Mark a task as complete or incomplete"""
    try:
        response = supabase.table("tasks").update({
            "completed": task_update.completed
        }).eq("id", task_id).execute()
        return {"message": "Task updated", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    """Delete a task"""
    try:
        response = supabase.table("tasks").delete().eq("id", task_id).execute()
        return {"message": "Task deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/team-members")
def get_team_members():
    """Get list of unique team members"""
    try:
        response = supabase.table("tasks").select("assigned_to").execute()
        # Get unique team members
        members = list(set([task["assigned_to"] for task in response.data if task["assigned_to"]]))
        return {"members": sorted(members)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
def get_stats():
    """Get team accountability statistics"""
    try:
        response = supabase.table("tasks").select("*").execute()
        tasks = response.data
        
        # Calculate stats per person
        stats = {}
        for task in tasks:
            person = task["assigned_to"]
            if person not in stats:
                stats[person] = {"total": 0, "completed": 0, "pending": 0}
            
            stats[person]["total"] += 1
            if task["completed"]:
                stats[person]["completed"] += 1
            else:
                stats[person]["pending"] += 1
        
        # Calculate completion rate
        for person in stats:
            total = stats[person]["total"]
            completed = stats[person]["completed"]
            stats[person]["completion_rate"] = round((completed / total * 100) if total > 0 else 0, 1)
        
        return {"stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
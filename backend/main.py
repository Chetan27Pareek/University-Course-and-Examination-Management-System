from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal
from models import Student, Course

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- SCHEMAS --------------------
class StudentCreate(BaseModel):
    name: str
    email: str

# -------------------- HOME --------------------
@app.get("/")
def home():
    return {"message": "Backend is running"}

# -------------------- STUDENTS --------------------

@app.get("/students")
def get_students():
    db = SessionLocal()
    return db.query(Student).all()

@app.post("/students")
def add_student(student: StudentCreate):
    db = SessionLocal()
    new_student = Student(name=student.name, email=student.email)
    db.add(new_student)
    db.commit()
    return {"message": "Student added"}

@app.delete("/students/{id}")
def delete_student(id: int):
    db = SessionLocal()
    student = db.query(Student).filter(Student.student_id == id).first()
    if student:
        db.delete(student)
        db.commit()
    return {"message": "Deleted"}

@app.put("/students/{id}")
def update_student(id: int, student: StudentCreate):
    db = SessionLocal()
    s = db.query(Student).filter(Student.student_id == id).first()
    if s:
        s.name = student.name
        s.email = student.email
        db.commit()
    return {"message": "Updated"}

# 🔍 SEARCH FEATURE
@app.get("/students/search/{name}")
def search_student(name: str):
    db = SessionLocal()
    return db.query(Student).filter(Student.name.ilike(f"%{name}%")).all()

# -------------------- COURSES --------------------

@app.get("/courses")
def get_courses():
    db = SessionLocal()
    return db.query(Course).all()
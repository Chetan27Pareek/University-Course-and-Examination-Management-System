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


# ---------------- COURSES CRUD ----------------

from pydantic import BaseModel

class CourseCreate(BaseModel):
    course_name: str
    credits: int

@app.post("/courses")
def add_course(course: CourseCreate):
    db = SessionLocal()
    new_course = Course(
        title=course.course_name,   # ✅ CORRECT FIELD
        credits=course.credits
    )
    db.add(new_course)
    db.commit()
    return {"message": "Course added"}

@app.delete("/courses/{id}")
def delete_course(id: int):
    db = SessionLocal()
    course = db.query(Course).filter(Course.id == id).first()
    if course:
        db.delete(course)
        db.commit()
    return {"message": "Deleted"}


from fastapi import Request
from sqlalchemy import text

@app.post("/query")
async def run_query(request: Request):
    db = SessionLocal()
    body = await request.json()
    query = body.get("query")

    try:
        result = db.execute(text(query))   # ✅ FIXED

        if query.lower().startswith("select"):
            rows = result.fetchall()
            return [dict(row._mapping) for row in rows]

        db.commit()
        return {"message": "Query executed successfully"}

    except Exception as e:
        return {"error": str(e)}
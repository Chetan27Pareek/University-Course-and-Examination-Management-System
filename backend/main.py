from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal
from models import Student, Course, Enrollment, Exam, Result

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
    
    
class EnrollmentCreate(BaseModel):
    student_id: int
    course_id: int

@app.post("/enroll")
def enroll_student(data: EnrollmentCreate):
    db = SessionLocal()
    enroll = Enrollment(
        student_id=data.student_id,
        course_id=data.course_id
    )
    db.add(enroll)
    db.commit()
    return {"message": "Student enrolled"}

@app.get("/enrollments")
def get_enrollments():
    db = SessionLocal()
    return db.query(Enrollment).all()

class ExamCreate(BaseModel):
    course_id: int
    date: str

@app.post("/exams")
def add_exam(data: ExamCreate):
    db = SessionLocal()
    exam = Exam(
        course_id=data.course_id,
        date=data.date
    )
    db.add(exam)
    db.commit()
    return {"message": "Exam added"}

@app.get("/exams")
def get_exams():
    db = SessionLocal()
    return db.query(Exam).all()

class ResultCreate(BaseModel):
    student_id: int
    exam_id: int
    marks: int
    grade: str

@app.post("/results")
def add_result(data: ResultCreate):
    db = SessionLocal()
    result = Result(
        student_id=data.student_id,
        exam_id=data.exam_id,
        marks=data.marks,
        grade=data.grade
    )
    db.add(result)
    db.commit()
    return {"message": "Result added"}

@app.get("/results")
def get_results():
    db = SessionLocal()
    return db.query(Result).all()



@app.get("/enrollments/details")
def get_enrollment_details():
    db = SessionLocal()

    query = text("""
        SELECT s.name AS student_name, c.title AS course_name
        FROM enrollments e
        JOIN students s ON e.student_id = s.student_id
        JOIN courses c ON e.course_id = c.id
    """)

    result = db.execute(query)
    rows = result.fetchall()

    return [dict(row._mapping) for row in rows]


@app.get("/results/details")
def get_result_details():
    db = SessionLocal()

    query = text("""
        SELECT s.name AS student_name, c.title AS course_name, r.marks, r.grade
        FROM results r
        JOIN students s ON r.student_id = s.student_id
        JOIN exams e ON r.exam_id = e.id
        JOIN courses c ON e.course_id = c.id
    """)

    result = db.execute(query)
    rows = result.fetchall()

    return [dict(row._mapping) for row in rows]

# DELETE ENROLLMENT
@app.delete("/enrollments/{id}")
def delete_enrollment(id: int):
    db = SessionLocal()
    e = db.query(Enrollment).filter(Enrollment.id == id).first()
    if e:
        db.delete(e)
        db.commit()
    return {"message": "Enrollment deleted"}

# UPDATE ENROLLMENT
@app.put("/enrollments/{id}")
def update_enrollment(id: int, data: EnrollmentCreate):
    db = SessionLocal()
    e = db.query(Enrollment).filter(Enrollment.id == id).first()
    if e:
        e.student_id = data.student_id
        e.course_id = data.course_id
        db.commit()
    return {"message": "Enrollment updated"}


# DELETE EXAM
@app.delete("/exams/{id}")
def delete_exam(id: int):
    db = SessionLocal()
    exam = db.query(Exam).filter(Exam.id == id).first()
    if exam:
        db.delete(exam)
        db.commit()
    return {"message": "Exam deleted"}

# UPDATE EXAM
@app.put("/exams/{id}")
def update_exam(id: int, data: ExamCreate):
    db = SessionLocal()
    exam = db.query(Exam).filter(Exam.id == id).first()
    if exam:
        exam.course_id = data.course_id
        exam.date = data.date
        db.commit()
    return {"message": "Exam updated"}

# DELETE RESULT
@app.delete("/results/{id}")
def delete_result(id: int):
    db = SessionLocal()
    r = db.query(Result).filter(Result.id == id).first()
    if r:
        db.delete(r)
        db.commit()
    return {"message": "Result deleted"}

# UPDATE RESULT
@app.put("/results/{id}")
def update_result(id: int, data: ResultCreate):
    db = SessionLocal()
    r = db.query(Result).filter(Result.id == id).first()
    if r:
        r.student_id = data.student_id
        r.exam_id = data.exam_id
        r.marks = data.marks
        r.grade = data.grade
        db.commit()
    return {"message": "Result updated"}

@app.put("/courses/{id}")
def update_course(id: int, data: CourseCreate):
    db = SessionLocal()
    c = db.query(Course).filter(Course.id == id).first()
    if c:
        c.title = data.course_name
        c.credits = data.credits
        db.commit()
    return {"message": "Course updated"}
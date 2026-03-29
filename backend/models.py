from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    credits = Column(Integer)
    
from sqlalchemy import Column, Integer, String, ForeignKey

# ---------------- ENROLLMENT ----------------
class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.student_id"))
    course_id = Column(Integer, ForeignKey("courses.id"))

# ---------------- EXAM ----------------
class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    date = Column(String)

# ---------------- RESULT ----------------
class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.student_id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))
    marks = Column(Integer)
    grade = Column(String)
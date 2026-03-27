from pydantic import BaseModel

class StudentCreate(BaseModel):
    name: str
    email: str

class CourseCreate(BaseModel):
    title: str
    credits: int
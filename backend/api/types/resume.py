from pydantic import BaseModel
from typing_extensions import Optional

__all__ = (
    "ResumeData",
)

class ContactData(BaseModel):
    email: str
    phone: str

class PersonData(BaseModel):
    full_name: str
    contact: ContactData

class EducationData(BaseModel):
    type: str
    institution: str
    qualification: Optional[str]
    compleation_year: str # TODO: might change this
    specialization: Optional[str]

class WorkExperienceData(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: str

class ResumeData(BaseModel):
    person: PersonData
    education: list[EducationData]
    work_experience: WorkExperienceData
    skills: list[str]
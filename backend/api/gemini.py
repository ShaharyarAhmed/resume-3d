import json
from pathlib import Path
from google.genai import Client
from decouple import config

from .types import ResumeData

__all__ = ()

GEMINI_API_KEY = config("GEMINI_API_KEY")

EXAMPLE_JSON = """
    {
        "person": {
            "full_name": "John Smith"
        },
        "education": [
            {
                "type": "school",
                "institution": "Some High School",
                "qualification": "A-levels",
                "year_completed": "1419984000",
                "specialization": "Science, Maths"
            },
            {
                "type": "college",
                "institution": "Some College",
                "qualification": "High School Diploma",
                "year_completed": "1419984000",
                "specialization": "Computer Science, Math"
            },
            {
                "type": "university",
                "institution": "Aston University",
                "degree": "Bachelor's in Computer Science",
                "qualification": "First-Class Honors",
                "year_completed": "1419984000",
                "specialization": "AI, Network Configuration, Secure Systems"
            }
            ...
        ],
        "work_experience": {
            "company": "Google"
        },
        ...
    }
"""

TYPES_RESUME_PY_CONTENTS = None

with open(Path(__file__).parent.joinpath("types", "resume.py"), mode = "r") as file:
    TYPES_RESUME_PY_CONTENTS = file.read()

#print("-->", TYPES_RESUME_PY_CONTENTS)

class GeminiClient():
    def __init__(self):
        # TODO: figure out a way to create a new 
        # conversation for each resume so we don't have overlap.
        self.client = Client(
            api_key = GEMINI_API_KEY,
        )

    def send_resume(self, resume_string: str) -> ResumeData: # TODO: change to return some object or something
        # random_user = self.__random_shit()

        # TODO: fill this in later
        prompt = f"""
        Below is my CV / Resume, can you take this and convert the details 
        (skills, education, work expeirence) to a consistent json format like this:

        ```json
        {EXAMPLE_JSON}
        ```
        and so on.... (the "..." indecates that there are more keys, please use the python pydantic example as the actual up-to-date and complete example)

        here is the rest of the example json object but as python pydantic modals (ALWAYS pioritize the keys in this over the keys in the other example):
        ```python
        {TYPES_RESUME_PY_CONTENTS}
        ```

        ONLY send the json object once, do NOT duplicate it / send multiple times. Just send once.

        All dates should be POSIX timesamp seconds in the json and education type should be consistant.

        If the field is optional and it does not exist in the CV, return "null" WITHOUT speechmarks.

        --- where the resume starts ---\n
        {resume_string}
        """

        print("Parsing resume to json data with gemini...")

        response = self.client.models.generate_content(
            model = "gemini-2.0-flash",
            contents = prompt
        )

        return self.__parse_ai_json_response_to_actual_dict(response.text)

    def __parse_ai_json_response_to_actual_dict(self, ai_response_string: str) -> ResumeData:
        response_string = ai_response_string.replace("```json", "").replace("```", "")

        data = json.loads(response_string)

        return data

    # def __random_shit(self) -> str:
    #     return ''.join(
    #         random.SystemRandom().choice(
    #             string.ascii_uppercase + string.digits
    #         )
    #         for _ in range(255)
    #     )
import random
import string
from google.genai import Client
from google.genai.types import GenerateContentResponse
from decouple import config

__all__ = ()

GEMINI_API_KEY = config("GEMINI_API_KEY")

EXAMPLE_JSON = {

}

class GeminiClient():
    def __init__(self):
        # TODO: figure out a way to create a new 
        # conversation for each resume so we don't have overlap.
        self.client = Client(
            api_key = GEMINI_API_KEY,
        )

    def send_resume(self, resume_string: str) -> GenerateContentResponse: # TODO: change to return some object or something
        random_user = self.__random_shit()

        # TODO: fill this in later
        pre_prompt = f"""
        Below is my CV/Resume, can you take this and convert the details 
        (skills, education, work expeirence) to a consistent json format like this:

        ```json
        {EXAMPLE_JSON}
        ```

        --- where the resume starts ---\n
        """

        response = self.client.models.generate_content(
            model = "gemini-2.0-flash",
            contents = pre_prompt + resume_string
        )

        return response

    def __random_shit(self) -> str:
        return ''.join(
            random.SystemRandom().choice(
                string.ascii_uppercase + string.digits
            )
            for _ in range(255)
        )
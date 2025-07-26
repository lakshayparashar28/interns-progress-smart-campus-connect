from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os
from dotenv import load_dotenv

from app.search.nlp_search import prompt_template   # import only the prompt

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    google_api_key=GEMINI_API_KEY
)

# Prompt template to structure the query

prompt = PromptTemplate.from_template(prompt_template)
parser = JsonOutputParser()
chain = prompt | llm | parser

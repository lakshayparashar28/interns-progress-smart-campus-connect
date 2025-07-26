from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from .recommender import extract_filters_from_query

router = APIRouter()

# Request model
class QueryRequest(BaseModel):
    user_query: str

# Response model
class FilterResponse(BaseModel):
    title_keywords: Optional[str]
    min_price: Optional[int]
    max_price: Optional[int]
    condition: Optional[str]
    sort_by: Optional[str]
    brand: Optional[str]

# have to create "extract-filter.json" mock file for demo. 
#{user.query:"need a refurbished dell laptop price range between 30000 and 40000, sort by price low to high"}
@router.post("/extract-filters", response_model=FilterResponse)
def extract_filters(request: QueryRequest):
    result = extract_filters_from_query(request.user_query)
    return result

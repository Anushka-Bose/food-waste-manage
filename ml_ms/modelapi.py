from fastapi import FastAPI
from pydantic import BaseModel, Field
import joblib
import numpy as np

model_save_path = r"..\models\food_waste_model.pkl"
app=FastAPI()
cool=joblib.load(model_save_path)

class food(BaseModel):
    meals_served: float
    kitchen_staff: float
    temperature_C: float
    humidity_percent: float=Field(ge=0, le=100)
    day_of_week: int=Field(ge=0, le=6)
    past_waste_kg: float=Field(ge=0)
    staff_experience: float
    Day: int=Field(ge=0,le=31)
    Month: int=Field(ge=0,le=12)
    Year: int
    DayOfWeek: int
    IsWeekend: int=Field(ge=0,le=1)
    WeekOfYear: int=Field(ge=1,le=52)
    MonthStart: int=Field(ge=0,le=1)
    MonthEnd: int=Field(ge=0,le=1)
    special_event_1: bool
    waste_category_GRAINS: bool
    waste_category_MEAT: bool
    waste_category_VEGETABLES: bool
    Season_Spring: bool
    Season_Summer: bool
    Season_Winter: bool
    StaffPerMeal: float
    ExperiencePerMeal: float
    Temp_Humidity: float
    PastWaste_3daysAvg: float
    PastWaste_7daysAvg: float


@app.get('/')
async def start():
    return { 'message' : "hello world"}


@app.post('/predwaste')
async def pred(data : food):
    allcols=data.model_dump()
    ordcols=[allcols[col] for col in cool["order"]]
    x_pred=np.array([ordcols])
    pred=cool["model"].predict(x_pred)[0]
    return { 'pred' : float(pred) }


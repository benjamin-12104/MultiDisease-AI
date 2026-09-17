from fastapi import FastAPI  # type: ignore[import-not-found]
from fastapi.middleware.cors import CORSMiddleware  # type: ignore[import-not-found]
from pydantic import BaseModel  # type: ignore[import-not-found]

from diabetes_predictors import predict_diabetes
from heart_predictors import predict_heart
from kidney_predictors import predict_kidney

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiabetesInput(BaseModel):
    HighBP: int
    HighChol: int
    CholCheck: int
    BMI: float
    Smoker: int
    Stroke: int
    HeartDiseaseorAttack: int
    PhysActivity: int
    HvyAlcoholConsump: int
    PhysHlth: int
    Sex: int
    Age: int

class HeartInput(BaseModel):
    Age: int
    Sex: int 
    ChestPainType: int
    RestingBP: int
    Cholesterol: int
    FastingBS: int
    RestingECG: int
    MaxHR: int
    ExerciseAngina: int 
    Oldpeak: float
    ST_Slope: int

class KidneyInput(BaseModel):
    age: int
    bp: int
    sg: float
    al: int 
    su: int
    rbc: int
    pc: int
    pcc: int
    ba: int
    bgr: float
    bu: float
    sc: float
    sod: float
    pot: float
    hemo: float
    pcv: float
    wbcc: int
    rbcc: float
    htn: int
    dm: int
    cad: int
    appet: int
    pe: int
    ane: int

@app.get("/")
def home():
    return {"message": "HELLO FASTAPI"}
    
@app.post('/predict/diabetes')
#def diabetes_predict(HighBP: int, HighChol: int, CholCheck: int, BMI: float, Smoker: int, Stroke: int, HeartDiseaseorAttack: int, PhysActivity: int, HvyAlcoholConsump: int,PhysHlth: int, Sex: int, Age: int):
def diabetes_predict(input_data: DiabetesInput):
    data = input_data.model_dump()
    return predict_diabetes(data)

@app.post('/predict/heart')
# def heart_predict(Age: int, Sex: int, ChestPainType: int, RestingBP: int, Cholesterol: int, FastingBS: int, RestingECG: int, MaxHR: int, ExerciseAngina: int, Oldpeak: float, ST_Slope: int):
def heart_predict(input_data: HeartInput):    
    data = input_data.model_dump()
    return predict_heart(data)

@app.post('/predict/kidney')
# def kidney_predict(age: int, bp: int, sg: float, al: int, su: int, rbc: int, pc: int, pcc: int, ba: int, bgr: float, bu: float, sc: float, sod: float, pot: float, hemo: float, pcv: float, wbcc: int, rbcc: float, htn: int, dm: int, cad: int, appet: int, pe: int, ane: int):
def kidney_predict(input_data: KidneyInput):  
    data = input_data.model_dump()
    return predict_kidney(data)
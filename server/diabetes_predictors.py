import joblib
from pathlib import Path
import pandas as pd
import shap 

BASE_DIR = Path(__file__).resolve().parent
# print(f"Current Path: {BASE_DIR}")

# datasets
diabetes_dataset_df = pd.read_csv(BASE_DIR/"datasets/diabetes.csv")
diabetes_dataset = diabetes_dataset_df.drop('Diabetes_binary', axis=1)

diabetes_model = joblib.load(BASE_DIR/"models/diabetes_model.pkl") # SVM model

# SHAP Explainer for Models
diabetes_explainer = shap.Explainer(diabetes_model.predict_proba, diabetes_dataset)

# Predict Diabetes 
def predict_diabetes(data):

    input_data = pd.DataFrame([data])

    prediction = diabetes_model.predict(input_data)[0]
    probability = diabetes_model.predict_proba(input_data)[0][1]
    prediction_string = "Diabetic" if prediction == 1 else "Non-Diabetic"
    risk_level = "High Risk" if probability >= 0.7 else "Moderate Risk" if probability >= 0.4 else "Low Risk"
    
    shap_values = diabetes_explainer(input_data)
    values = shap_values.values

    if values.ndim == 3:
        values = values[0, :, 1]
    else:
        values = values[0]
    
    contributions = []
    
    for feature, value, shap_value in zip(input_data.columns, input_data.iloc[0], values):
        contributions.append({
            "feature": feature,
            "value": value,
            "shap_value": float(shap_value),
            "shap_value_percentage": round(float(shap_value) * 100, 2), # this gives the percentage contribution of each feature to the prediction
            "direction": ("increases risk" if shap_value > 0 else "decreases risk")
        })
        
        # Sort by strongest contribution
        contributions.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
        
        # Get the top 5 contributing factors
        top_factors = contributions[:5]
    
    overall_info(shap_values, input_data, contributions, top_factors)
    
    return {
        "prediction": int(prediction),
        "probability": float(probability),
        "risk_score": round(float(probability) * 100, 2),
        "prediction_string": prediction_string,
        "risk_level": risk_level,
        "top_factors": top_factors
    }
    
def overall_info(shap_values, input_data, contributions, top_factors):
    # Overall SHAP Summary
    shap.summary_plot(shap_values, input_data, show=False)
    # shap.save_html("shap_summary.html")
    
    # Save contributions to a CSV file
    contributions_df = pd.DataFrame(contributions)
    print(contributions_df)
    # contributions_df.to_csv("shap_contributions.csv", index=False)
    
    # Save top factors to a CSV file
    top_factors_df = pd.DataFrame(top_factors)
    print(top_factors_df)
    # top_factors_df.to_csv("top_shap_factors.csv", index=False)
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, recall_score, f1_score, roc_auc_score
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
from sklearn.pipeline import Pipeline

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
print("Current Path:",BASE_DIR)
print()

# Load the Dataset 
dataset_path = BASE_DIR/"datasets/diabetes.csv"

df = pd.read_csv(dataset_path)

# Split the dataset into features and target variable
x = df.drop('Diabetes_binary', axis=1)
y = df['Diabetes_binary']

# Split the dataset into training and testing sets
x_train, x_test, y_train, y_test = train_test_split(
    x,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("--------------------- Dataset Info -------------------")
print(f"Dataset Shape: {df.shape}")
print(f"Columns: {x.columns.tolist()}")
# print(f"Number of Samples: {x.shape[0]}")
print(f"Target Distribution:\n{y.value_counts()}")
print("------------------------------------------------------")
print()

# Applying SMOTE to handle imbalance class 
smote = SMOTE(random_state=42)
x_train_smote, y_train_smote = smote.fit_resample(x_train, y_train)


model=  Pipeline([
            ("scaler", StandardScaler()),
            ("model", SVC(probability=True, random_state=42))])

# Train the SVM model
# model = SVC(kernel='linear', probability=True, random_state=42)

# model.fit(x_train, y_train)
model.fit(x_train_smote, y_train_smote)

# Evaluate the model
results = []
train_pred = model.predict(x_train)
test_pred = model.predict(x_test)

train_acc = accuracy_score(y_train, train_pred) * 100
test_acc = accuracy_score(y_test, test_pred) * 100
gap = train_acc - test_acc
rec = recall_score(y_test, test_pred, zero_division=0)
f1 = f1_score(y_test, test_pred, zero_division=0)

if hasattr(model, "predict_proba"):
    y_prob = model.predict_proba(x_test)[:, 1]
else:
    y_prob = model.decision_function(x_test)

roc_auc = roc_auc_score(y_test, y_prob) * 100

results.append({
            "Model": "Support Vector Machine",
            "Train Accuracy (%)": train_acc,
            "Test Accuracy (%)": test_acc,
            "Recall": rec,
            "F1": f1,
            "ROC-AUC (%)": roc_auc,
            "Gap (%)": gap
        })

results_df = pd.DataFrame(results).sort_values(
        by="Test Accuracy (%)",
        ascending=False
    ).reset_index(drop=True).iloc[0].T

# output 

print("-------------------- Model Evaluation Results -------------------")
print()
print(results_df)
print("-----------------------------------------------------------------")
print()

# Adding Model(pkl) to Model Folder 
# model_path = BASE_DIR/"models/diabetes_model.pkl"
# joblib.dump(model, model_path)
# print(f"Model moved to: {model_path}")
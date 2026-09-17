import { useState } from "react";
import axios from "axios";
// import ShapBarChart from "../graph/ShapBarChart.jsx";
// import ShapPieChart from "../graph/ShapPieChart.jsx";
// import ShapWaterfall from "../graph/ShapWaterfall.jsx";
import ShapBarChart from "../../graph/ShapBarChart.jsx";
import ShapPieChart from "../../graph/ShapPieChart.jsx";
import ShapWaterfall from "../../graph/ShapWaterfall.jsx";

const diabetesFields = [
  { name: "HighBP", label: "High Blood Pressure", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Do you have high blood pressure?" },
  { name: "HighChol", label: "High Cholesterol", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Do you have high cholesterol?" },
  { name: "CholCheck", label: "Cholesterol Check in 5 Years", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Have you had your cholesterol checked in the last 5 years?" },
  { name: "BMI", label: "BMI (Body Mass Index)", type: "number", min: 10, max: 60, step: 0.1, help: "Your Body Mass Index" },
  { name: "Smoker", label: "Smoker", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Have you smoked at least 100 cigarettes in your entire life?" },
  { name: "Stroke", label: "Stroke History", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Have you ever had a stroke?" },
  { name: "HeartDiseaseorAttack", label: "Heart Disease or Attack", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Coronary heart disease or heart attack" },
  { name: "PhysActivity", label: "Physical Activity", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Physical activity in past 30 days" },
  { name: "HvyAlcoholConsump", label: "Heavy Alcohol Consumption", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Heavy alcohol consumption (men >14 drinks/week, women >7 drinks/week)" },
  { name: "PhysHlth", label: "Physical Health Days", type: "number", min: 0, max: 30, step: 1, help: "Number of days physical health was not good in past 30 days" },
  { name: "Sex", label: "Sex", type: "select", options: [{ value: 0, label: "Female" }, { value: 1, label: "Male" }], help: "Biological sex" },
  { name: "Age", label: "Age Category", type: "select", options: [
    { value: 1, label: "18-24" }, { value: 2, label: "25-29" }, { value: 3, label: "30-34" },
    { value: 4, label: "35-39" }, { value: 5, label: "40-44" }, { value: 6, label: "45-49" },
    { value: 7, label: "50-54" }, { value: 8, label: "55-59" }, { value: 9, label: "60-64" },
    { value: 10, label: "65-69" }, { value: 11, label: "70-74" }, { value: 12, label: "75-79" },
    { value: 13, label: "80+" }
  ], help: "Age category" },
];

export default function DiabetesPage() {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const predictDiabetes = async () => {
    console.log(formData);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/diabetes", formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setResult(null);
    setError(null);
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel === "High Risk") return "text-red-600 bg-red-100";
    if (riskLevel === "Moderate Risk") return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diabetes Risk Prediction</h1>
          <p className="text-gray-600">Enter your health information to assess diabetes risk</p>
        </div>

        {!result ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={(e) => { e.preventDefault(); predictDiabetes(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diabetesFields.map((field) => (
                  <div key={field.name} className={field.name === "Age" ? "lg:col-span-3" : ""}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={(e) => handleChange(field.name, field.name === "Age" ? parseInt(e.target.value) : parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select...</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    )}
                    {field.help && <p className="mt-1 text-xs text-gray-500">{field.help}</p>}
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Predicting..." : "Predict Diabetes Risk"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{result.prediction_string}</h2>
                  <p className="text-gray-600 mt-1">Based on your health profile</p>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-4xl font-bold text-blue-600">{result.risk_score}%</div>
                  <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level}
                  </span>
                </div>
              </div>
              <p className="mt-6 text-gray-700">{result.prediction === 1 ? "High risk of diabetes detected. Please consult a healthcare professional." : "Low risk of diabetes. Maintain a healthy lifestyle."}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ShapBarChart factors={result.top_factors} />
              <ShapPieChart factors={result.top_factors} />
            </div>

            <ShapWaterfall factors={result.top_factors} probability={result.risk_score / 100} />

            <div className="flex justify-center pt-4">
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                New Prediction
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
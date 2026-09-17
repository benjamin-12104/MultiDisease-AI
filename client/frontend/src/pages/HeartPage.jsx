import { useState } from "react";
import axios from "axios";
import ShapBarChart from "../../graph/ShapBarChart.jsx";
import ShapPieChart from "../../graph/ShapPieChart.jsx";
import ShapWaterfall from "../../graph/ShapWaterfall.jsx";

const heartFields = [
  { name: "Age", label: "Age", type: "number", min: 18, max: 100, step: 1, help: "Age in years" },
  { name: "Sex", label: "Sex", type: "select", options: [{ value: 0, label: "Female" }, { value: 1, label: "Male" }], help: "Biological sex" },
  { name: "ChestPainType", label: "Chest Pain Type", type: "select", options: [
    { value: 0, label: "Typical Angina" },
    { value: 1, label: "Atypical Angina" },
    { value: 2, label: "Non-anginal Pain" },
    { value: 3, label: "Asymptomatic" }
  ], help: "Type of chest pain experienced" },
  { name: "RestingBP", label: "Resting Blood Pressure (mmHg)", type: "number", min: 80, max: 200, step: 1, help: "Resting blood pressure in mmHg" },
  { name: "Cholesterol", label: "Serum Cholesterol (mg/dl)", type: "number", min: 100, max: 600, step: 1, help: "Serum cholesterol in mg/dl" },
  { name: "FastingBS", label: "Fasting Blood Sugar > 120 mg/dl", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Fasting blood sugar > 120 mg/dl" },
  { name: "RestingECG", label: "Resting ECG Results", type: "select", options: [
    { value: 0, label: "Normal" },
    { value: 1, label: "ST-T Wave Abnormality" },
    { value: 2, label: "Left Ventricular Hypertrophy" }
  ], help: "Resting electrocardiographic results" },
  { name: "MaxHR", label: "Maximum Heart Rate Achieved", type: "number", min: 60, max: 220, step: 1, help: "Maximum heart rate achieved during exercise" },
  { name: "ExerciseAngina", label: "Exercise Induced Angina", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], help: "Exercise induced angina" },
  { name: "Oldpeak", label: "ST Depression (Oldpeak)", type: "number", min: 0, max: 10, step: 0.1, help: "ST depression induced by exercise relative to rest" },
  { name: "ST_Slope", label: "ST Slope", type: "select", options: [
    { value: 0, label: "Upsloping" },
    { value: 1, label: "Flat" },
    { value: 2, label: "Downsloping" }
  ], help: "Slope of the peak exercise ST segment" },
];

export default function HeartPage() {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const predictHeart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/heart", formData);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Heart Disease Risk Prediction</h1>
          <p className="text-gray-600">Enter your health information to assess heart disease risk</p>
        </div>

        {!result ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={(e) => { e.preventDefault(); predictHeart(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heartFields.map((field) => (
                  <div key={field.name} className={field.name === "Age" ? "" : ""}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                        onChange={(e) => handleChange(field.name, Number(e.target.value))}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Predicting..." : "Predict Heart Disease Risk"}
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
                  <div className="text-4xl font-bold text-red-600">{result.risk_score}%</div>
                  <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level}
                  </span>
                </div>
              </div>
              <p className="mt-6 text-gray-700">{result.prediction === 1 ? "High risk of heart disease detected. Please consult a healthcare professional." : "Low risk of heart disease. Maintain a healthy lifestyle."}</p>
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
import { useState } from "react";
import axios from "axios";
// import ShapBarChart from "../graph/ShapBarChart.jsx";
// import ShapPieChart from "../graph/ShapPieChart.jsx";
// import ShapWaterfall from "../graph/ShapWaterfall.jsx";
import ShapBarChart from "../../graph/ShapBarChart.jsx";
import ShapPieChart from "../../graph/ShapPieChart.jsx";
import ShapWaterfall from "../../graph/ShapWaterfall.jsx"; // frontend/graph/file.jsx          ../ - means get to folder of this ../../ - folder of folder

// ./       = here
// ../      = go up 1
// ../../   = go up 2
// ../../../= go up 3
// folder/  = go down into folder

const kidneyFields = [
  { name: "age", label: "Age", type: "number", min: 1, max: 100, step: 1, help: "Age in years" },
  { name: "bp", label: "Blood Pressure (mmHg)", type: "number", min: 50, max: 200, step: 1, help: "Blood pressure in mmHg" },
  { name: "sg", label: "Specific Gravity", type: "select", options: [
    { value: 1.005, label: "1.005" },
    { value: 1.010, label: "1.010" },
    { value: 1.015, label: "1.015" },
    { value: 1.020, label: "1.020" },
    { value: 1.025, label: "1.025" }
  ], help: "Specific gravity of urine" },
  { name: "al", label: "Albumin", type: "select", options: [
    { value: 0, label: "0 - None" },
    { value: 1, label: "1 - Trace" },
    { value: 2, label: "2 - +" },
    { value: 3, label: "3 - ++" },
    { value: 4, label: "4 - +++" },
    { value: 5, label: "5 - ++++" }
  ], help: "Albumin level in urine" },
  { name: "su", label: "Sugar", type: "select", options: [
    { value: 0, label: "0 - None" },
    { value: 1, label: "1 - Trace" },
    { value: 2, label: "2 - +" },
    { value: 3, label: "3 - ++" },
    { value: 4, label: "4 - +++" },
    { value: 5, label: "5 - ++++" }
  ], help: "Sugar level in urine" },
  { name: "rbc", label: "Red Blood Cells", type: "select", options: [
    { value: 1, label: "Normal" },
    { value: 0, label: "Abnormal" }
  ], help: "Red blood cells in urine" },
  { name: "pc", label: "Pus Cells", type: "select", options: [
    { value: 1, label: "Normal" },
    { value: 0, label: "Abnormal" }
  ], help: "Pus cells in urine" },
  { name: "pcc", label: "Pus Cell Clumps", type: "select", options: [
    { value: 1, label: "Present" },
    { value: 0, label: "Not Present" }
  ], help: "Pus cell clumps" },
  { name: "ba", label: "Bacteria", type: "select", options: [
    { value: 1, label: "Present" },
    { value: 0, label: "Not Present" }
  ], help: "Bacteria in urine" },
  { name: "bgr", label: "Blood Glucose Random (mg/dl)", type: "number", min: 50, max: 500, step: 1, help: "Random blood glucose level" },
  { name: "bu", label: "Blood Urea (mg/dl)", type: "number", min: 10, max: 400, step: 1, help: "Blood urea level" },
  { name: "sc", label: "Serum Creatinine (mg/dl)", type: "number", min: 0.5, max: 15, step: 0.1, help: "Serum creatinine level" },
  { name: "sod", label: "Sodium (mEq/L)", type: "number", min: 100, max: 160, step: 1, help: "Sodium level" },
  { name: "pot", label: "Potassium (mEq/L)", type: "number", min: 2, max: 7, step: 0.1, help: "Potassium level" },
  { name: "hemo", label: "Hemoglobin (g/dl)", type: "number", min: 3, max: 20, step: 0.1, help: "Hemoglobin level" },
  { name: "pcv", label: "Packed Cell Volume (%)", type: "number", min: 10, max: 60, step: 1, help: "Packed cell volume" },
  { name: "wbcc", label: "White Blood Cell Count (cells/cumm)", type: "number", min: 2000, max: 25000, step: 100, help: "White blood cell count" },
  { name: "rbcc", label: "Red Blood Cell Count (millions/cumm)", type: "number", min: 2, max: 8, step: 0.1, help: "Red blood cell count" },
  { name: "htn", label: "Hypertension", type: "select", options: [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" }
  ], help: "Hypertension" },
  { name: "dm", label: "Diabetes Mellitus", type: "select", options: [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" }
  ], help: "Diabetes mellitus" },
  { name: "cad", label: "Coronary Artery Disease", type: "select", options: [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" }
  ], help: "Coronary artery disease" },
  { name: "appet", label: "Appetite", type: "select", options: [
    { value: 1, label: "Good" },
    { value: 0, label: "Poor" }
  ], help: "Appetite" },
  { name: "pe", label: "Pedal Edema", type: "select", options: [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" }
  ], help: "Pedal edema" },
  { name: "ane", label: "Anemia", type: "select", options: [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" }
  ], help: "Anemia" },
];

const fieldGroups = [
  { title: "Patient Demographics", fields: ["age", "bp"] },
  { title: "Urine Analysis", fields: ["sg", "al", "su", "rbc", "pc", "pcc", "ba"] },
  { title: "Blood Tests", fields: ["bgr", "bu", "sc", "sod", "pot", "hemo", "pcv", "wbcc", "rbcc"] },
  { title: "Medical History", fields: ["htn", "dm", "cad", "appet", "pe", "ane"] },
];

export default function KidneyPage() {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const predictKidney = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/kidney", formData);
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
    setActiveTab(0);
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel === "High Risk") return "text-red-600 bg-red-100";
    if (riskLevel === "Moderate Risk") return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getField = (name) => kidneyFields.find(f => f.name === name);

  const isFieldValid = (name) => {
    const field = getField(name);
    const value = formData[name];
    if (value === undefined || value === "" || value === null) return false;
    if (field.type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) return false;
      if (field.min !== undefined && num < field.min) return false;
      if (field.max !== undefined && num > field.max) return false;
    }
    return true;
  };

  const getGroupValidity = (group) => {
    const filled = group.fields.filter(f => isFieldValid(f)).length;
    const total = group.fields.length;
    return { filled, total, isComplete: filled === total };
  };

  const allFieldsValid = () => {
    return kidneyFields.every(f => isFieldValid(f.name));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kidney Disease Risk Prediction</h1>
          <p className="text-gray-600">Enter patient health information to assess chronic kidney disease risk</p>
        </div>

        {!result ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100">
              <nav className="flex overflow-x-auto" aria-label="Form sections">
                {fieldGroups.map((group, index) => {
                  const validity = getGroupValidity(group);
                  return (
                    <button
                      key={group.title}
                      onClick={() => setActiveTab(index)}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                        index === activeTab
                          ? "text-indigo-600 border-b-2 border-indigo-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {group.title}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        validity.isComplete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {validity.filled}/{validity.total}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); predictKidney(); }} className="p-6">
              <div className="space-y-6">
                {fieldGroups.map((group, groupIndex) => (
                  <div key={group.title} className={activeTab === groupIndex ? "block" : "hidden"}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">{group.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.fields.map((fieldName) => {
                        const field = getField(fieldName);
                        if (!field) return null;
                        return (
                          <div key={field.name} className="space-y-1">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                              {field.label}
                            </label>
                            {field.type === "select" ? (
                              <select
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] !== undefined ? formData[field.name] : ""}
                                onChange={(e) => handleChange(field.name, field.options[0].value === 0 || field.options[0].value === 1 ? parseInt(e.target.value) : parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
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
                                value={formData[field.name] !== undefined ? formData[field.name] : ""}
                                onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                placeholder="Enter value"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${
                                  formData[field.name] !== undefined && !isFieldValid(field.name)
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                                required
                              />
                            )}
                            {field.help && <p className="mt-1 text-xs text-gray-500">{field.help}</p>}
                            {formData[field.name] !== undefined && !isFieldValid(field.name) && (
                              <p className="mt-1 text-xs text-red-500">Value out of range</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mt-4">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading || !allFieldsValid()}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Predicting..." : "Predict Kidney Disease Risk"}
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
                  <p className="text-gray-600 mt-1">Based on patient health profile</p>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-4xl font-bold text-indigo-600">{result.risk_score}%</div>
                  <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level}
                  </span>
                </div>
              </div>
              <p className="mt-6 text-gray-700">
                {result.prediction === 1
                  ? "High risk of chronic kidney disease detected. Please consult a nephrologist for further evaluation."
                  : "Low risk of chronic kidney disease. Continue regular health monitoring."}
              </p>
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
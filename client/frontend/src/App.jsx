import { useState, useEffect } from "react";
import { useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import HeartPage from "./pages/HeartPage";
import DiabetesPage from "./pages/DiabetesPage";
import KidneyPage from "./pages/KidneyPage";
import { Menu, X, HeartPulse, Droplets, Activity } from "lucide-react";
import { LuUpload } from "react-icons/lu";

const navItems = [
  { path: "/heart", label: "Heart", icon: "❤️", color: "red" },
  { path: "/diabetes", label: "Diabetes", icon: "🩸", color: "blue" },
  { path: "/kidney", label: "Kidney", icon: "🫘", color: "amber" },
];

const colorClasses = {
  red: "bg-red-50 text-red-600 hover:bg-red-100",
  blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  amber: "bg-amber-200 text-black hover:bg-amber-200",
};


function Navigation() {
  const location = useLocation();
  const [hammerOpen, sethammerOpen] = useState(false);

  const menuRef = useRef(null);
useEffect(() => {
    const handleClickOutside = (event) => {
      // If menu is open and click is outside the menu
      if (
        hammerOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        sethammerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hammerOpen]);
  
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">HealthRisk AI</Link>

          <div className="hidden md:block md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname === item.path
                    ? colorClasses[item.color]
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
            
            {/* for mobile */}
          <div className="lg:hidden md:hidden" ref={menuRef}>
            <button
            className = "absolute left-95 bottom-5"
            type="button"
            onClick={()=>sethammerOpen(!hammerOpen)}>
              {hammerOpen ? <X size={25}/> : <Menu size={25}/>}
            </button>
              {
            hammerOpen && 
            <div className="w-32.5 lg:hidden md:hidden absolute top-15 left-70 backdrop-blur rounded-2xl z-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-2xl flex items-center gap-1.5 ${
                  location.pathname === item.path
                    ? colorClasses[item.color]
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          }
          </div>

          {/* Upload Health Report */}
          {/* <div className="absolute z-100 w-25 left-65 h-10 md:left-335 p-5 bg-red-500 hover:bg-red-600 delay-75 rounded-2xl">
              <input 
              type="file" 
              id="pdfupload"
              className="hidden"
              />

              <label 
              htmlFor="pdfupload"
              className="cursor-pointer"
              >
                  <LuUpload />
                  Report
              </label>
          </div> */}

          {/* <div className="absolute left-5 top-3 w-25 z-100 md:left-335 md:right-6 md:w-30">
            <input
              type="file"
              id="pdfupload"
              accept=".pdf,application/pdf"
              className="hidden"
            />

            <label
              htmlFor="pdfupload"
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 text-sm font-medium text-white shadow-md transition duration-200 hover:bg-red-600 hover:shadow-lg active:scale-95"
            >
              <LuUpload size={18} />
              <span>Report</span>
            </label>  
          </div> */}
        </div> 
      </div>
    </nav>

  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 to-blue-600 mb-6">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Risk Prediction</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered risk assessment for heart disease, diabetes, and chronic kidney disease.
            Enter patient data to get instant risk predictions with explainable AI insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group bg-white rounded-xl border border-gray-100 p-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${colorClasses[item.color].replace("hover:bg-red-100", "").replace("hover:bg-blue-100", "").replace("hover:bg-indigo-100", "")}`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.label}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {item.path === "/heart" && "Assess cardiovascular disease risk using clinical parameters"}
                {item.path === "/diabetes" && "Evaluate diabetes risk based on health indicators"}
                {item.path === "/kidney" && "Screen for chronic kidney disease using lab values"}
              </p>
              <span className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:underline">
                Start Assessment →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 p-6 bg-white rounded-xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">1</div>
              <div>
                <h4 className="font-medium text-gray-900">Enter Data</h4>
                <p className="text-sm text-gray-500">Fill in patient health information</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">2</div>
              <div>
                <h4 className="font-medium text-gray-900">Get Prediction</h4>
                <p className="text-sm text-gray-500">AI model analyzes risk factors</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">3</div>
              <div>
                <h4 className="font-medium text-gray-900">View Insights</h4>
                <p className="text-sm text-gray-500">SHAP explanations show key factors</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>⚠️ This tool is for educational purposes only. Always consult a healthcare professional for medical decisions.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/heart" element={<HeartPage />} />
          <Route path="/diabetes" element={<DiabetesPage />} />
          <Route path="/kidney" element={<KidneyPage />} />
        </Routes>
        
        <footer className="bg-white border-t border-gray-100 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
            HealthRisk AI - Machine Learning for Clinical Decision Support
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
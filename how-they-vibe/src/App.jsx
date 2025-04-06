import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";
import "./App.css"; 

function App() {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2); // Move to Analyze step
    } else if (step === 2) {
      setStep(3); // Move to Results step
    } else if (step === 3) {
      setStep(1); // Go back to Upload step
    }
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <Sidebar currentStep={step} />

      {/* Main Content */}
      <div className="main-content">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        
        <button onClick={handleNextStep}>
          {step === 1
            ? "Analyze"
            : step === 2
            ? "See Results"
            : "Try New Track"}
        </button>
      </div>
    </div>
  );
}

export default App;

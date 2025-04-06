import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";
import "./App.css";
import ModernButton from "./components/ModernButton/ModernButton";

function App() {
  const [step, setStep] = useState(1);
  const [isAnalyzingDone, setIsAnalyzingDone] = useState(false); // Track if analysis is done

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && isAnalyzingDone) {
      setStep(3);
    } else if (step === 3) {
      setIsAnalyzingDone(false); // ✅ Reset analysis state
      setStep(1);
    }
  };
  
  const handleAnalysisComplete = () => {
    setIsAnalyzingDone(true); // Set analysis as complete when Step2 finishes
  };

  return (
    <div className="App">
      <Sidebar currentStep={step} />

      {/* Main Content */}
      <div className="main-content">

        {step === 1 && <Step1 />}
        {step === 2 && <Step2 onAnalysisComplete={handleAnalysisComplete} />}
        {step === 3 && <Step3 />}

        {/* Conditionally render the "See Results" button only when analysis is done */}
        {step === 2 && isAnalyzingDone && (
          <ModernButton onClick={handleNextStep}>
            See Results
          </ModernButton>
        )}

        {/* "Analyze" and "Try New Track" buttons */}
        {step === 1 && (
          <ModernButton onClick={handleNextStep}>
            Analyze
          </ModernButton> 
        )}
        {step === 3 && (
          <ModernButton onClick={handleNextStep}>
          Try New Track 
        </ModernButton> 
        )}
      </div>
    </div>
  );
}

export default App;



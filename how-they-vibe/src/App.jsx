import { useState } from "react";
import Sidebar from "./components/Sidebar";
import "./App.css"; 
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";

function App() {
  const [step, setStep] = useState(1);

  return (
    <div className="App">
      {/* Sidebar */}
      <Sidebar currentStep={step} setStep={setStep} />

      {/* Main Content */}
      <div className="main-content">
        <div className="page">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </div>
      </div>
    </div>
  );
}

export default App;

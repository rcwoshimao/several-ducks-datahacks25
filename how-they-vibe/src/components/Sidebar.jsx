import React from "react";
import './Sidebar.css'; 

const Sidebar = ({ currentStep, setStep }) => {
  const steps = ["Upload", "Analyze", "Results"];

  return (
    <div className="sidebar">
      <h2>How They Vibe</h2>
      <ul>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const stepStatus =
            currentStep === stepNumber
              ? "active"
              : currentStep > stepNumber
              ? "completed"
              : "inactive";

          return (
            <li
              key={stepNumber}
              className={`${stepStatus}`}
              onClick={() => setStep(stepNumber)}
            >
              {step}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;

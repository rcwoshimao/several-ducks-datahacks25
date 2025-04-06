import React from "react";
import "./Sidebar.css"; 
import upload from "./../assets/upload.png"; 
import analyze from "./../assets/analyze.png"; 
import results from "./../assets/results.png"; 

const Sidebar = ({ currentStep }) => {
    const steps = [
        { name: "Upload", icon: upload },
        { name: "Analyze", icon: analyze},
        { name: "Results", icon: results },
      ];

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
            <li key={stepNumber} className={`sidebar-steps ${stepStatus}`}>
              <img
                src={step.icon} // Dynamically load the image based on step
                alt={step.name}
                className="step-icon"
              />
              {step.name}

            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;

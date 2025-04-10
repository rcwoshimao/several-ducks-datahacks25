import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";
import ModernButton from "./components/ModernButton/ModernButton";
import { ResultContext } from "./ResultContext";
import "./App.css";



const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
};

const buttonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '/api/analyze';

function App() {
  const [step, setStep] = useState(1);
  const [audioFile, setAudioFile] = useState(null);
  const [trackName, setTrackName] = useState("");
  const [isAnalyzingDone, setIsAnalyzingDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const { setResult } = useContext(ResultContext);

  const handleAnalyzeApiCall = async () => {
    if (!audioFile || !trackName.trim()) {
      setError("Please provide both a track name and an audio file.");
      return; // Stop if validation fails
    }

    setIsLoading(true); // Start loading indicator
    setError(null); // Clear previous errors

    // Create FormData to send file and name
    const formData = new FormData();
    formData.append('audio', audioFile); // Key 'audioFile' - adjust if your server expects different
    formData.append('trackName', trackName); // Key 'trackName' - adjust if needed

    try {
      console.log(`Sending analysis request to: ${API_ENDPOINT}`); // For debugging
      
      setStep(2); // Move to Step 2 (Analyzing page)
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      
      
      // Check if the request was successful
      if (!response.ok) {
        let errorMsg = `API request failed with status ${response.status}`;
        try {
            const errorData = await response.json(); // Try parsing JSON error
            errorMsg = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
            errorMsg = `${errorMsg}: ${await response.text()}`; // Fallback to text error
        }
        throw new Error(errorMsg);
      }

      
      // --- Success ---
      console.log("API request successful, proceeding to Step 2.");
      
      // If you need data *back* from the API before proceeding:
      const result = await response.json();
      setResult(result);
      console.log("API Response Data:", result);

    } catch (err) {
      // --- Error Handling ---
      console.error("API Call Error:", err);
      setError(err.message || "An unknown error occurred during analysis.");
      // Stay on Step 1 to show the error
    } finally {
      // --- Cleanup ---
      setIsLoading(false); // Stop loading indicator regardless of success/failure
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      handleAnalyzeApiCall();
    } else if (step === 2 && isAnalyzingDone) {
      setStep(3);
    } else if (step === 3) {
      setIsAnalyzingDone(false);
      setStep(1);
    }
  };

  const handleFileUpload = (fileUploaded) => {
    if (fileUploaded) {
      setAudioFile(fileUploaded);
    }
  };

  const handleTrackNameChange = (newTrackName) => {
    setTrackName(newTrackName);
  };

  const isButtonDisabled = !audioFile || trackName.trim() === "";

  return (
    <div className="App">
      <Sidebar currentStep={step} />
      <div className="main-content p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mb-8 relative min-h-[500px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full min-h-[500px] relative" // Add relative positioning to avoid overlap
              >
                <Step1 onFileUploaded={handleFileUpload} trackName={trackName} onTrackNameChange={handleTrackNameChange} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full min-h-[500px] relative" // Keep relative positioning
              >
                <Step2 onAnalysisComplete={() => setIsAnalyzingDone(true)} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full min-h-[500px] relative" // Ensure step 3 is correctly positioned
              >
                <Step3 />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="analyze-button" variants={buttonVariants} initial="initial" animate="animate" exit="exit" className="relative z-10">
              <ModernButton onClick={handleNextStep} disabled={isButtonDisabled}>
                Analyze
              </ModernButton>
            </motion.div>
          )}

          {step === 2 && isAnalyzingDone && (
            <motion.div key="results-button" variants={buttonVariants} initial="initial" animate="animate" exit="exit" className="relative z-10">
              <ModernButton onClick={handleNextStep}>
                See Results
              </ModernButton>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="new-track-button" variants={buttonVariants} initial="initial" animate="animate" exit="exit" className="relative z-10">
              <ModernButton onClick={handleNextStep}>
                Try New Track
              </ModernButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;

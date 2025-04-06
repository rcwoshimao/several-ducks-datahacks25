import React, { useState, useEffect } from "react";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import PulseLoader from "../components/PulseLoader/PulseLoader";

const Step2 = ({ onAnalysisComplete }) => {
    const [round, setRound] = useState(0);
    const [isAnalyzingDone, setIsAnalyzingDone] = useState(false);
    const totalRounds = 2;

    useEffect(() => {
        // Check if analysis is complete
        if (round >= totalRounds) {
            setIsAnalyzingDone(true);
            onAnalysisComplete();
            return;
        }

        // Start the round
        const timeout = setTimeout(() => {
            setRound(prev => prev + 1);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [round, totalRounds, onAnalysisComplete]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Step 2: Analyzing</h3>

            {!isAnalyzingDone && <PulseLoader />}

            <p className="text-center">
                {!isAnalyzingDone 
                    ? `Analyzing Round ${round + 1} - AI is analyzing...` 
                    : "Your analysis is ready!"}
            </p>

            <div className="space-y-5">
                <ProgressBar value={(round / totalRounds) * 100} />
            </div>
        </div>
    );
};

export default Step2;

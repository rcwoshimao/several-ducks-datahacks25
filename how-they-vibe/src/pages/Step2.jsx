import React, { useState, useEffect } from "react";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import PulseLoader from "../components/PulseLoader/PulseLoader";

const Step2 = ({ onAnalysisComplete }) => {
    const [round, setRound] = useState(0);
    const [comments, setComments] = useState(["Loading comments..."]);
    const [isAnalyzingDone, setIsAnalyzingDone] = useState(false);
    const totalRounds = 2;

    useEffect(() => {
        // Check if analysis is complete
        if (round >= totalRounds) {
            setComments(["Your analysis is ready!"]); // Change comment after analysis is complete
            setIsAnalyzingDone(true);
            onAnalysisComplete();
            return;
        }

        // Start the round
        const timeout = setTimeout(() => {
            setRound(prev => prev + 1);
            setComments(["New comment round", "AI is analyzing..."]);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [round, totalRounds, onAnalysisComplete]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Step 2: Analyzing</h3>

            {!isAnalyzingDone && <PulseLoader />}

            <p className="text-center">{`Analyzing Round ${round + 1}`}</p>
            <div className="mb-4">
                {comments.map((comment, index) => (
                    <p key={index} className="text-sm text-gray-600">{comment}</p>
                ))}
            </div>
            <div className="space-y-5">
                <ProgressBar title="Current Round Progress" value={(round / totalRounds) * 100} />
            </div>
        </div>
    );
};

export default Step2;

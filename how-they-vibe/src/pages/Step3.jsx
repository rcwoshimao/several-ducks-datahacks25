import React, { useEffect, useState, useContext } from "react";
const dataPath = import.meta.env.VITE_EXTERNAL_DATA_PATH;
import AgentAnalytics from "../components/Visualization";
import CommentsSection from "../components/CommentSection/CommentSection";
import { ResultContext } from "../ResultContext";

const Step3 = () => {
  const [agentData, setAgentData] = useState(null);
  // Access the global result from the context
  const { result } = useContext(ResultContext);

  useEffect(() => {
    fetch(dataPath)
      .then((res) => res.json())
      .then((json) => setAgentData(json))
      .catch((err) => console.error("Failed to load agent data:", err));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Your Track Analytics</h1>
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Track Information</h4>
        {/* Replace the static summary with the transcription from the global result */}
        <p>
          Summary:{" "}
          {result && result.transcription
            ? result.transcription
            : "Loading transcription..."}
        </p>
      </div>
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Sentiment Visualization</h4>
        {agentData ? (
          <AgentAnalytics data={agentData} />
        ) : (
          <p>Loading agent analytics...</p>
        )}
      </div>
      <CommentsSection />
    </div>
  );
};

export default Step3;

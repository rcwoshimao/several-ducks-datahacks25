import React, { useEffect, useState } from "react";
const dataPath = import.meta.env.VITE_EXTERNAL_DATA_PATH;
import AgentAnalytics from "../components/Visualization";
import CommentsSection from "../components/CommentSection/CommentSection";

const Step3 = () => {
  const [agentData, setAgentData] = useState(null);

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
        <p>Track: Lo-fi Sunset</p>
        <p>Summary: This track is relaxing, and agents love it for studying.</p>
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

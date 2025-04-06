import React from "react";
const dataPath = import.meta.env.VITE_EXTERNAL_DATA_PATH;

const Step3 = () => {
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
        {/* Add your charts here */}
      </div>
    </div>
  );
};

export default Step3;

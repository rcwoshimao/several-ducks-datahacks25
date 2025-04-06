import React from "react";

const Step3 = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Step 3: Results</h3>
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Track Information</h4>
        <p>Track: Lo-fi Sunset</p>
        <p>Genre: Lo-fi</p>
        <p>Summary: This track is relaxing, and agents love it for studying.</p>
      </div>
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Sentiment Visualization</h4>
        {/* Add your charts here */}
      </div>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded"
        onClick={() => alert("Moving to next step!")}
      >
        Try New Track
      </button>
    </div>
  );
};

export default Step3;

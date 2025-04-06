import React, { useState } from "react";

const Step1 = () => {
  const [trackName, setTrackName] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else {
      alert("Please give the correct format");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Step 1: Upload Track</h3>
      <input
        type="text"
        value={trackName}
        onChange={(e) => setTrackName(e.target.value)}
        placeholder="Track Name"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="file"
        onChange={handleAudioUpload}
        className="w-full mb-4"
      />
      <button
        onClick={() => alert("Track uploaded!")}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Analyze
      </button>
    </div>
  );
};

export default Step1;

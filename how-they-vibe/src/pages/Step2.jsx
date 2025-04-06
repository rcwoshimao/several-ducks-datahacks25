import React, { useState, useEffect } from "react";

const Step2 = () => {
  const [round, setRound] = useState(1);
  const [comments, setComments] = useState(["Loading comments..."]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRound((prev) => prev + 1);
      setComments(["New comment round", "AI is analyzing..."]);
    }, 5000);

    return () => clearInterval(timer);
  }, [round]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Step 2: Analyzing</h3>
      <div className="rounded-full w-16 h-16 bg-gray-300 animate-pulse mb-4"></div>
      <p className="text-center">{`Analyzing Round ${round}`}</p>
      <div className="mb-4">
        {comments.map((comment, index) => (
          <p key={index} className="text-sm text-gray-600">{comment}</p>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-2 mb-4">
        <div className="bg-blue-500 h-2" style={{ width: `${(round / 5) * 100}%` }}></div>
      </div>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded"
        onClick={() => alert("Analysis done!")}
      >
        See Results
      </button>
    </div>
  );
};

export default Step2;

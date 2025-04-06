import React from "react";

const ProgressBar = ({ title, value }) => {
  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-800">{value}%</span>
      </div>
      <div
        className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

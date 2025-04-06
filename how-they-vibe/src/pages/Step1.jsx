import React, { useState } from "react";
import TextInput from "../components/TextInput/TextInput";
import './pages.css'; 

const Step1 = ({ onFileUploaded, trackName, onTrackNameChange }) => {
  const [audioFile, setAudioFile] = useState(null);

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      onFileUploaded(file); // Notify App.jsx that a file has been uploaded
    } else {
      alert("Please upload a valid audio file.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Step 1: Upload Track</h1>
      <div className="max-w-sm space-y-3">
        <TextInput
          type="text"
          id="track-name-input"
          placeholder="Input Track Name"
          value={trackName}
          onChange={(e) => onTrackNameChange(e.target.value)} // Pass the new track name back to App.jsx
        />
      </div>

      <div
        className={`file-input flex items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
          audioFile ? 'bg-green-100' : ''
        }`}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            {!audioFile ? (
              <>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  MP3, WAV, or AAC (MAX. 50MB)
                </p>
              </>
            ) : (
              <p className="text-sm text-green-800 font-semibold">
                {audioFile.name}
              </p>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleAudioUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default Step1;

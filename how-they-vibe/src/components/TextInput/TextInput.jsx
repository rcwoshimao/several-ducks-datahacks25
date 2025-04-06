import React from 'react';
import './TextInput.css';

const TextInput = ({ placeholder, value, onChange }) => {
  return (
    <div className="textinput max-w-sm space-y-3">
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          className="peer py-4 sm:py-5 pe-0 ps-8 block w-[400px] bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200 sm:text-lg focus:border-t-transparent focus:border-x-transparent focus:outline-none focus:border-b-black focus:ring-0 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextInput;

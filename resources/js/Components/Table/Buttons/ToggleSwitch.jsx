import { useState } from 'react';
import { useTheme } from '../../../Context/ThemeContext';

const ToggleSwitch = ({ label, value, onChange, addMainClass}) => {
  const { theme } = useTheme();

  const toggle = () => onChange(!value);

  return (
    <label className={`flex items-center w-fit cursor-pointer space-x-2 ${addMainClass}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={value}
          onChange={toggle}
          className="sr-only"
        />
        <div className={`w-9 h-5 rounded-full ${value ? theme : 'bg-gray-300'}`}></div>
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            value ? 'translate-x-4' : ''
          }`}
        />
      </div>
      <span className={`text-xs ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}`}>{label}</span>
    </label>
  );
};

export default ToggleSwitch;


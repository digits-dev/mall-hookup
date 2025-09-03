import React, { useState } from "react";
import { useTheme } from "../../Context/ThemeContext";

const SliderInput = ({ min = 3, max = 10, step = 1, defaultValue = 3, onChange }) => {
  const { theme } = useTheme();
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  const fillColor = theme === "bg-skin-blue" ? "#1e3a8a" : "#cccbca";
  const bgColor = "#e5e7eb";
  const percentage = ((value - min) / (max - min)) * 100;
  const trackBackground = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percentage}%, ${bgColor} ${percentage}%, ${bgColor} 100%)`;

  const thumbClass = theme === "bg-skin-blue" ? "slider-thumb-blue" : "slider-thumb";

  return (
    <div className="w-full">
      <div className={`${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'} flex justify-between text-xs font-medium px-1`}>
        <span>{min}s</span>
        <span>{max}s</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${thumbClass}`}
        style={{ background: trackBackground }}
      />
    </div>
  );
};

export default SliderInput;

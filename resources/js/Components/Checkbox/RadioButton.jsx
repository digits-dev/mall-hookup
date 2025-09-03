import React, { useState } from 'react'

const RadioButton = ({ name, options, defaultValue, onChange, textColor = "text-white" }) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue || "")

    const handleChange = (value) => {
        setSelectedValue(value)
        if (onChange) {
          onChange(value)
        }
    }

  return (
    <div className="flex flex-col space-y-3">
      {options.map((option, index) => (
        <label key={index} htmlFor={index} className="flex cursor-pointer items-center">
          <div className="relative flex h-5 w-5 items-center justify-center">
            <input
              type="radio"
              id={index}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleChange(option.value)}
              className="sr-only" // Hide the actual radio input
            />
            {/* Custom radio outer circle */}
            <div
              className={`absolute md:h-5 md:w-5 h-4 w-4 rounded-full border ${
                selectedValue === option.value ? "border-blue-500 bg-white" : "border-blue-300 bg-white"
              } transition-colors duration-200`}
            ></div>
            {/* Custom radio inner dot */}
            {selectedValue === option.value && <div className="absolute h-2 w-2 md:h-3 md:w-3 rounded-full bg-blue-500"></div>}
          </div>
          <span  className={`ml-2 ${textColor} text-xs md:text-sm`}> {option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default RadioButton
import React from "react";

const Checkbox = ({ id, type="checkbox" , name, handleClick, isChecked, disabled, addClass }) => {
    return (
        <div className={`inline-flex items-center ${addClass}`}>
            <label
                className="relative flex cursor-pointer items-center rounded-full p-1"
                htmlFor={id} // Use dynamic id
                data-ripple-dark="true"
            >
                <input
                    id={id}
                    name={name}
                    type={type}
                    onChange={handleClick}
                    disabled={disabled}
                    checked={isChecked}
                    className={`before:content[''] bg-white peer relative h-[16px] w-[16px] cursor-pointer appearance-none rounded-md border border-gray-400 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-8 before:w-8 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-400 checked:before:bg-blue-400 hover:before:opacity-10 outline-none ${
                        disabled
                            ? "bg-gray-500 border-gray-500"
                            : ""
                    }`}
                />
                <div
                    className={`pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white transition-opacity ${
                        isChecked || disabled ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                    >
                        {disabled ? (
                            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                        ) : (
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            ></path>
                        )}
                    </svg>
                </div>
            </label>
        </div>
    );
};

export default Checkbox;

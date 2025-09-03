import React from 'react'
import LoginInputTooltip from '../Tooltip/LoginInputTooltip'

const InputWithLogo = ({title, value, name, icon, type, placeholder, onError, onChange, addMainClass, addTitleClass, addInputClass}) => {
  return (
    <div className={`w-full font-open-sans text-sm md:text-base ${addMainClass} relative`}>
        {title && 
          <p className={`text-xs md:text-sm mb-1 font-semibold ${addTitleClass} `}>{title}</p>
        }
        <div className={`flex items-center relative border ${onError ? 'border-red-600' : 'border-accent'} overflow-hidden rounded-md md:rounded-lg md:border-2`}>
          <i className={`${icon} px-3 h-full ${onError ? 'text-red-600' : 'text-accent'} `}></i>
          <input 
              className={`px-2 border-l text-sm md:border-l-2 ${onError ? 'border-red-600' : 'border-accent' } py-1 bg-transparent w-full outline-none placeholder:text-gray-400 md:px-3 md:py-2 placeholder:font-parkinsans placeholder:text-xs md:placeholder:text-sm  ${addInputClass}`} 
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={onChange}
              type={type}
          />
          {onError && 
            <LoginInputTooltip content={onError}>
              <i
                className="fa-solid fa-circle-info text-red-600 absolute cursor-pointer top-1/2 text-xs md:text-base right-1.5 md:right-3 transform -translate-y-1/2">
              </i>
            </LoginInputTooltip>
          }
          </div> 
    </div>
  )
}

export default InputWithLogo
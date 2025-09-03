import React from 'react'
import LoginInputTooltip from '../Tooltip/LoginInputTooltip'


const LoginInput = ({title, value, name, type, placeholder, onError, onChange, addMainClass, addTitleClass, addInputClass}) => {
  return (
    <div className={`w-full font-poppins text-sm z-20 md:text-base ${addMainClass} relative`}>
        {title && 
          <p className={`md:mb-1 ${addTitleClass} text-white `}>{title}</p>
        }
        <div className={`relative border ${onError ? 'border-red-600' : 'border-accent'} overflow-hidden rounded-md md:rounded-lg md:border-2`}>
          <input 
              className={`px-2 py-1 w-full outline-none placeholder:text-gray-400 md:px-3 md:py-2 ${addInputClass}`} 
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

export default LoginInput
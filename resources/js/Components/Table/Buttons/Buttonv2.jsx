import { Link } from '@inertiajs/react'
import React from 'react'
import { useTheme } from '../../../Context/ThemeContext'

const Buttonv2 = ({
    type = "button", 
    onClick, 
    href, 
    name, 
    icon,
    color,
    fontWeight = 'font-semibold', 
    textColor = "text-white", 
    addClass, 
    disabled = false 
}) => {
  const {theme} = useTheme();

  return (
    <>
        {type == 'button' ? 
            <button className={`${color || theme} w-fit items-center select-none ${textColor} space-x-2 flex justify-center px-3 py-2 md:px-3 md:py-2 rounded-md hover:opacity-70 cursor-pointer ${disabled ? theme + '/70 !cursor-not-allowed' : ''} ${addClass}`} onClick={disabled ? undefined : onClick}>
                {icon && <i className={`${icon} text-xs md:text-sm`}></i>}
                <span className={`${fontWeight} text-[10px] md:text-xs text-nowrap`}>{name}</span>
            </button>
        :
            <Link href={disabled ? '' : href} className={`${theme} w-fit items-center select-none ${textColor} space-x-2 flex justify-center px-3 py-2 md:px-3.5 md:py-2.5 rounded-md hover:opacity-70 cursor-pointer  ${disabled ? 'bg-accent2/70 !cursor-not-allowed' : ''} ${addClass}`}>
                {icon && <i className={`${icon} text-xs md:text-sm`}></i>}
                <span className='font-semibold text-[10px] md:text-xs'>{name}</span>
            </Link>
        }
    </>
    
  )
}

export default Buttonv2
import React, { useRef, useState } from 'react'
import { useTheme } from '../../Context/ThemeContext';
import FormatLabelName from '../../Utilities/FormatLabelName';
import LoginInputTooltip from '../Tooltip/LoginInputTooltip';

const ImageInput = ({name, setData, onError, displayName, value, action, isImageEdited, setIsImageEdited}) => {
    const { theme } = useTheme();
    const fileInputRef = useRef(null);
    const [imageError, setImageError] = useState(null);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
    
            if (!validTypes.includes(file.type)) {
                setImageError('Only PNG, GIF and JPEG images are allowed');
                return;
            }
            setData(name, file);
            setIsImageEdited(true);
            setImageError(null);
          
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };


  return (
    <div>
        <label
            className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}
        >
            {displayName || FormatLabelName(name)}
        </label>
        <div className={`flex items-center relative w-full mt-1 text-xs overflow-hidden rounded-md border ${onError || imageError ? 'border-red-600' : 'border-accent'}`}>
            <button
                onClick={handleButtonClick}
                className={`${theme} text-white text-xs px-4 py-2.5 rounded-md font-medium`}
                type="button"
            >
                {value ? 'Change Image' : 'Choose Image'}
            </button>
            <div className={`${!value && 'text-gray-500'} px-4 py-2 flex-1 truncate w-full`}>
                {
                    action === 'Update'
                    ? !isImageEdited
                    ? value || 'No image chosen'
                    : value?.name || 'No image chosen'
                    : action === 'Create'
                    ? value?.name || 'No image chosen'
                    : 'No image chosen'
                }
            </div>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageChange} />
            {onError || imageError && 
                <LoginInputTooltip content={onError ? onError : imageError ? imageError : null}>
                <i
                    className="fa-solid fa-circle-info text-red-600 absolute cursor-pointer top-1/2 text-xs md:text-base right-1.5 md:right-3 transform -translate-y-1/2">
                </i>
                </LoginInputTooltip>
            }
        </div>
    </div>
  )
}

export default ImageInput
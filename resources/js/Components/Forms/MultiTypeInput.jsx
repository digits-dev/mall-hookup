import React from 'react'
import InputComponent from '../Forms/Input';
import CustomSelect from '../Dropdown/CustomSelect';
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';
import CheckboxWithText from '../Checkbox/CheckboxWithText';
import RadioButton from '../Checkbox/RadioButton';
import LoginInputTooltip from '../Tooltip/LoginInputTooltip';

const MultiTypeInput = ({type, name, value, disabled, placeholder, onChange, selectInputOptions = [], menuPlacement, displayName, onError, handleCheckboxClick, isChecked, checkbox_label, radioDefaultValue, radioOptions = []}) => {
    
    const {theme} = useTheme();
    const { textColor, primayActiveColor } = useThemeStyles(theme);


  return (
    <>
        {type == 'text' ? 
            <InputComponent
                name={name}
                value={value}
                type='text'
                displayName={displayName}
                disabled={disabled}
                placeholder={placeholder}
                onChange={onChange}
                onError={onError}
            />
        :
            type == 'date' ? 
            <InputComponent
                name={name}
                value={value}
                displayName={displayName}
                type='date'
                disabled={disabled}
                placeholder={placeholder}
                onChange={onChange}
                onError={onError}
            />
        :   type == 'select' ? 
            <CustomSelect
                placeholder={placeholder}
                selectType="react-select"
                defaultSelect={placeholder}
                onChange={onChange}
                displayName={displayName}
                name={name}
                isDisabled={disabled}
                menuPlacement={menuPlacement}
                options={selectInputOptions}
                value={value}
                onError={onError}
            />
        : type == 'select multiple' ? 
            <CustomSelect
                placeholder={placeholder}
                selectType="react-select"
                defaultSelect={placeholder}
                onChange={onChange}
                isMulti={true}
                displayName={displayName}
                name={name}
                isDisabled={disabled}
                menuPlacement={menuPlacement}
                options={selectInputOptions}
                value={value}
                onError={onError}
            />
        
        : type == 'checkbox' ?
            <div className='flex flex-col items-start'>
                <label
                    htmlFor={name}
                    className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}
                >
                    {displayName || FormatLabelName(name)}
                </label>
                <div className={`relative w-full ${onError && 'border rounded-lg mt-1 border-dashed border-red-500'}`}>
                    <CheckboxWithText
                        id="custom-checkbox"         
                        type="checkbox"             
                        name="exampleCheckbox"
                        color='blue'
                        text={checkbox_label}
                        textColor={textColor}
                        handleClick={handleCheckboxClick} 
                        isChecked={isChecked}        
                        disabled={false}            
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
            
        : type == 'radio button' ?
            <div className='flex flex-col items-start justify-start'>
                <label
                    htmlFor={name}
                    className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}
                >
                    {displayName || FormatLabelName(name)}
                </label>
                <div className={`relative w-full p-3 ${onError && 'border rounded-lg mt-1 border-dashed border-red-500'}`}>
                    <RadioButton
                        name="subscription-plan"
                        options={radioOptions}
                        textColor={textColor}
                        defaultValue={radioDefaultValue}
                        onChange={onChange}
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
        
        : null
        }
    </>
  )
}

export default MultiTypeInput
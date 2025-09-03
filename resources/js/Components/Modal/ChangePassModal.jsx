import React, { useState } from 'react'
import Buttonv2 from '../Table/Buttons/Buttonv2';
import { useTheme } from '../../Context/ThemeContext';
import { router, useForm, usePage } from '@inertiajs/react';
import CheckboxWithText from '../Checkbox/CheckboxWithText';
import InputWithLogo from '../Forms/InputWithLogo';
import useThemeStyles from '../../Hooks/useThemeStyles';
import { useToast } from '../../Context/ToastContext';

const ChangePassModal = ({}) => {
    const { auth } = usePage().props;
    const { check_user, check_user_type } = auth.sessions;
    const { theme } = useTheme();
    const { textColor } = useThemeStyles(theme);
    const { handleToast } = useToast();
    const [isOpen, setIsOpen] = useState(check_user);
    const [isChecked, setIsChecked] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState('');
    const [isUpperCase, setIsUpperCase] = useState(false);
    const [isLowerCase, setIsLowerCase] = useState(false);
    const [isCorrectLength, setIsCorrectLength] = useState(false);
    const [isSpecialChar, setIsSpecialChar] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    const { data, setData, processing, reset, post, errors } = useForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const handleCheckboxClick = () => {
        setIsChecked(!isChecked);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setData("new_password", newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };[]
    
    const handleSubmit = (e) =>{
        post("change_password/update", {
            onSuccess: (data) => {
                const { message, type } = data.props.auth.sessions;
                handleToast(message, type)
                setIsOpen(false);
                setTimeout(() => router.post('logout'), 3000);
            },
            onError: (newErrors) => {
                console.log(newErrors);
            }
        }); 
    }

    const handleWaiveSubmit = (e) =>{
        post("change_password/waive", {
            onSuccess: (data) => {
                const { message, type } = data.props.auth.sessions;
                handleToast(message, type)
                setIsOpen(false);
            },
            onError: (newErrors) => {
                console.log(newErrors);
            }
        }); 
    }

    const checkPasswordStrength = (password) => {
        let strength = 0;
    
        // 8 characters
        setIsCorrectLength(password.length >= 8);
        strength += password.length >= 8 ? 1 : 0;
    
        // is Uppercase
        setIsUpperCase(/[A-Z]/.test(password));
        strength += /[A-Z]/.test(password) ? 1 : 0;
        
        // is Lowercase
        setIsLowerCase(/[a-z]/.test(password));
        strength += /[a-z]/.test(password) ? 1 : 0;
        
        // is Number
        setIsNumber(/[0-9]/.test(password));
        strength += /[0-9]/.test(password) ? 1 : 0;
        
        // is Special Char
        setIsSpecialChar(/[^A-Za-z0-9]/.test(password));
        strength += /[^A-Za-z0-9]/.test(password) ? 1 : 0;
    
        if (strength == 5){
            setIsDisabled(false)
        }
        else {
            setIsDisabled(true)
        }
    
        return (strength / 5) * 100;
    };

  return (
    <div className={`fixed inset-0 z-100 select-none w-screen font-parkinsans h-screen bg-black/50 flex justify-center items-center duration-100 ease-in ${isOpen ? 'opacity-100' : 'opacity-0  pointer-events-none'}`}>
      <div className={`${theme === 'bg-skin-black' ? 'bg-black-table-color' : 'bg-white'}  max-w-[37rem] w-full m-5 rounded-lg shadow-lg duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className='p-4 border-b-2'>
            <p className={`${theme === 'bg-skin-black' ? 'text-white' : 'text-black'} font-semibold text-lg text-center`}>Change Password</p>
        </div>
        <div className='flex flex-col p-5'>
         <p className='text-xs'><span className='text-red-500 font-bold'>Warning: 
            </span>{ check_user_type == 'default' ? ' We have detected that your password is still set to the default, posing a security risk, and recommend updating it immediatelly to a strong, unique password' : ' Our records indicate that it has been 90 days since you last updated your password. To safeguard your account, we ask that you change your password immediately. Please ensure that your new password is strong and unique to help maintain the security of your account' }
        </p>
            <div className='border mt-4 p-5 rounded-lg'>
                <InputWithLogo 
                    title="Current Password" 
                    icon="fa-solid fa-lock"
                    placeholder="Enter Current Password"
                    onError={errors.current_password} 
                    onChange={(e) =>
                    setData("current_password", e.target.value)
                    }
                    type={isChecked ? 'text' : 'password'}
                    value={data.current_password}
                />
                <InputWithLogo 
                    title="New Password" 
                    icon="fa-solid fa-lock"
                    placeholder="Enter New Password"
                    onError={errors.new_password}
                    addMainClass="mt-2"
                    onChange={handlePasswordChange}
                    type={isChecked ? 'text' : 'password'}
                    value={data.new_password}
                />
                {data.new_password && (
                        <div className="mt-3">
                            <div className="relative w-full h-1.5 md:h-3 bg-gray-200 rounded">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded transition-all ${passwordStrength < 40 ? 'bg-red-500': passwordStrength < 70 ? 'bg-yellow-400': 'bg-green-500'}`}
                                    style={{
                                        width: `${passwordStrength}%`
                                    }}
                                ></div>
                            </div>
                            <div className="text-xs mt-1">
                                {passwordStrength < 40
                                    ? 'Weak Password'
                                    : passwordStrength < 70
                                    ? 'Medium Password'
                                    : 'Strong Password'}
                            </div>
                            <div className="text-xs mt-1 text-gray-500">
                                <div className={`${isUpperCase && 'text-green-500'}`}><i className={`${isUpperCase ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span className='text-[10px] md:text-xs'>Must include at least one uppercase letter</span></div>
                                <div className={`${isLowerCase && 'text-green-500'}`}><i className={`${isLowerCase ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span className='text-[10px] md:text-xs'>Must include at least one uppercase letter</span></div>
                                <div className={`${isCorrectLength && 'text-green-500'}`}><i className={`${isCorrectLength ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span className='text-[10px] md:text-xs'>Minimum length of 8 characters</span></div>
                                <div className={`${isSpecialChar && 'text-green-500'}`}><i className={`${isSpecialChar ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span className='text-[10px] md:text-xs'>Must include at least one special character (e.g., @$;!%*#?&)</span></div>
                                <div className={`${isNumber && 'text-green-500'}`}><i className={`${isNumber ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span className='text-[10px] md:text-xs'>Must contain at least one number</span></div>
                            </div>
                        </div>
                    )}
                <InputWithLogo 
                    title="Confirm Password" 
                    icon="fa-solid fa-lock"
                    placeholder="Confirm New Password"
                    onError={errors.confirm_password}
                    addMainClass="mt-2"
                    onChange={(e) =>
                    setData("confirm_password", e.target.value)
                    }
                    type={isChecked ? 'text' : 'password'}
                    value={data.confirm_password}
                />
                <CheckboxWithText
                    id="custom-checkbox"         
                    type="checkbox"             
                    name="exampleCheckbox"
                    textColor={textColor}
                    handleClick={handleCheckboxClick} 
                    isChecked={isChecked}        
                    disabled={false}
                    color='blue'
                    addMainClass="justify-end mt-2"         
                />
                <div className='flex space-x-2 mt-2'>
                    <Buttonv2 name="Change Password" addClass="w-full !p-3 mt-2" onClick={handleSubmit} disabled={isDisabled || processing}/>
                    {!errors.message && check_user_type == 'waive' && <Buttonv2 color="bg-green-500" name="Waive" addClass="w-full !p-3 mt-2" onClick={handleWaiveSubmit} disabled={errors.message || processing}/>}
                </div>
                {errors.message && <p className='text-center mt-4 text-xs text-red-500 font-medium'>{errors.message}</p> }
            </div>
          
        </div>
      </div>
    </div>
  )
}

export default ChangePassModal
import React, { useContext, useEffect, useState } from 'react';
import ContentPanel from '../../Components/Table/ContentPanel';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AnimationData from '../../../../public/Animations/changepass-anim.json'
import InputWithLogo from '../../Components/Forms/InputWithLogo';
import { useToast } from '../../Context/ToastContext';
import { useTheme } from '../../Context/ThemeContext';
import { NavbarContext } from '../../Context/NavbarContext';
import useThemeStyles from '../../Hooks/useThemeStyles';
import Lottie from 'lottie-react';
import CheckboxWithText from '../../Components/Checkbox/CheckboxWithText';
import Modalv2 from '../../Components/Modal/Modalv2';
import Buttonv2 from '../../Components/Table/Buttons/Buttonv2';

const ChangePassword = () => {

    const {theme} = useTheme();
    const { textColor, primayActiveColor } = useThemeStyles(theme);
    const { handleToast } = useToast();
    const { setTitle } = useContext(NavbarContext);

    const [isChecked, setIsChecked] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    useEffect(() => {
        setTimeout(()=>{
            setTitle("Change Password");
        },5);
    }, []);

    
    const handleCheckboxClick = () => {
        setIsChecked(!isChecked);
    };

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

    const handlePasswordChange = (e) => {
        e.preventDefault();
        const newPassword = e.target.value;
        setData("new_password", newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };[]

    const handleSubmit = (e) =>{
        post("change_password/update", {
          onSuccess: (data) => {
              const { message, type } = data.props.auth.sessions;
              handleToast(message, type)
              setTimeout(() => router.post('logout'), 3000);
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
        <>
            <Head title="Change Password" />
            <ContentPanel>
                <div className={`flex flex-col md:flex-row h-full py-10 md:p-0 font-parkinsans select-none ${textColor}`}>
                    <div className='flex items-center justify-center flex-1 md:ml-10'>
                        <Lottie animationData={AnimationData} className='w-full h-full max-w-48 max-h-48 md:max-w-[26rem] md:max-h-[26rem]' style={{background: 'transparent'}}/>
                    </div>
                    <form className='p-5 md:p-10 mt-5 md:mt-0 flex-1' onSubmit={handlePasswordChange}>
                        <div className='border-2 border-accent2 border-dashed rounded-xl p-5 md:p-10 flex flex-col h-full  md:w-[500px]'>
                        <p className="mb-5 text-[10px] md:text-sm"><span className="text-red-500 font-bold mr-1"> Note: </span>If you would like to update your account password, please provide your current password, followed by your new desired password. To confirm the change, kindly re-enter the new password to ensure accuracy and completion of the update process.</p>
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
                            addMainClass="justify-end mt-2"         
                        />
                        <Buttonv2 name="Change Password" addClass="w-full !p-3 mt-2" onClick={()=>{setOpenConfirmModal(true)}} disabled={isDisabled || processing}/>
                        </div>
                    </form>
                    <Modalv2 
                        isOpen={openConfirmModal} 
                        setIsOpen={setOpenConfirmModal}
                        title="Confirm Password Change"
                        content="Are you sure you want to change your password? This action cannot be undone"
                        onConfirm={handleSubmit}
                    />
                </div>
            </ContentPanel>
        </>
    );
};

export default ChangePassword;

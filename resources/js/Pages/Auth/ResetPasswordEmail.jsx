import React, { useState } from "react";
import InputWithLogo from "../../Components/Forms/InputWithLogo";
import { Head, Link, router, useForm } from "@inertiajs/react";
import axios from "axios";
import LoginInput from "../../Components/Forms/LoginInput";
import CheckboxWithText from "../../Components/Checkbox/CheckboxWithText";

const ResetPasswordEmail = ({ email }) => {
    const { data, setData, reset, post, processing } = useForm({
        email: email || "",
        new_password: "",
        confirm_password: "",
    });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState('');
    const [isUpperCase, setIsUpperCase] = useState(false);
    const [isLowerCase, setIsLowerCase] = useState(false);
    const [isCorrectLength, setIsCorrectLength] = useState(false);
    const [isSpecialChar, setIsSpecialChar] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxClick = () => {
        setIsChecked(!isChecked);
    };


    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setData((resetPasswordData) => ({
            ...resetPasswordData,
            [key]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setData((prevData) => ({
            ...prevData,
            new_password: newPassword
        }));
    
        setPasswordStrength(checkPasswordStrength(newPassword));
    };
    

    const checkPasswordStrength = (password) => {
        let strength = 0;
    
        const newState = {
            isCorrectLength: password.length >= 8,
            isUpperCase: /[A-Z]/.test(password),
            isLowerCase: /[a-z]/.test(password),
            isNumber: /[0-9]/.test(password),
            isSpecialChar: /[^A-Za-z0-9]/.test(password),
        };
    
        // Calculate strength
        strength += newState.isCorrectLength ? 1 : 0;
        strength += newState.isUpperCase ? 1 : 0;
        strength += newState.isLowerCase ? 1 : 0;
        strength += newState.isNumber ? 1 : 0;
        strength += newState.isSpecialChar ? 1 : 0;
    
        // Update all states at once
        setIsCorrectLength(newState.isCorrectLength);
        setIsUpperCase(newState.isUpperCase);
        setIsLowerCase(newState.isLowerCase);
        setIsNumber(newState.isNumber);
        setIsSpecialChar(newState.isSpecialChar);
    
        return (strength / 5) * 100; // Return percentage value for the progress bar
    };
    

    const validate = () => {
        const newErrors = {};
        if (!data.new_password){
            newErrors.new_password = "New Password is required";
        }
        else {
            const password = data.new_password;
            // Validate password length (at least 8 characters)
            if (password.length < 8) {
                newErrors.new_password = "Password must be at least 8 characters long";
            }
            // Validate at least one uppercase letter
            if (!/[A-Z]/.test(password)) {
                newErrors.new_password = "Password must contain at least one uppercase letter";
            }
            // Validate at least one lowercase letter
            if (!/[a-z]/.test(password)) {
                newErrors.new_password = "Password must contain at least one lowercase letter";
            }
            // Validate at least one number
            if (!/[0-9]/.test(password)) {
                newErrors.new_password = "Password must contain at least one number";
            }
            // Validate at least one special character
            if (!/[@$!%*#?&]/.test(password)) {
                newErrors.new_password = "Password must contain at least one special character";
            }
        }
           
        if (!data.confirm_password)
            newErrors.confirm_password = "Confirm Password is required";
        if (data.new_password != data.confirm_password) {
            newErrors.confirm_password = "Passwords not Match";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            post('/send_resetpass_email/reset', {
                onSuccess: (data) => {
                    reset();
                    const { message, type } = data;
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        },
                    });
                    Toast.fire({
                        icon: "success",
                        title: message,
                    }).then(() => {
                        router.visit("/login");
                    });

                },
                onError: (data) => {
                    const { message, type } = data;
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        },
                    });
                    Toast.fire({
                        icon: "error",
                        title: message,
                    }).then(() => {
                        reset();
                        setErrors({});
                    });
                }
            });
        }
    };

    return (
        <>
            <Head title='Reset Password'/>
            <div className="flex flex-col items-center p-5 justify-center w-screen h-screen font-poppins " >
                <img className='w-full h-full absolute' src='/images/login-page/login-bg.jpg'/>
                <img className='w-12 h-12 md:w-16 md:h-16 mb-3 z-50' src='/images/others/digits-icon.png'/>
                <p className='text-white text-md md:text-xl font-semibold z-50'>Digits Item Masterfile System</p>
                <form onSubmit={handleSubmit} className="flex flex-col m-5 items-center z-50 bg-white/20 w-full border border-white/40 rounded-xl shadow-lg p-6 max-w-md">
                    <p className='text-white text-xl md:text-2xl font-semibold my-4'>Reset Password</p>
                    <p className="text-red-300 text-xs md:text-sm w-full">
                        *Please fill all the fields
                    </p>
                    <LoginInput
                        addMainClass="mt-2"
                        placeholder="Enter New Password"
                        title="New Password"
                        name="new_password"
                        value={data.new_password}
                        type={isChecked ? 'text' : 'password'}
                        onError={errors.new_password}
                        onChange={handlePasswordChange}
                    />
                    {data.new_password && (
                        <div className="mt-3 w-full">
                            <div className="relative w-full h-3 bg-gray-200 rounded">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded transition-all ${passwordStrength < 40 ? 'bg-red-500': passwordStrength < 70 ? 'bg-yellow-400': 'bg-green-500'}`}
                                    style={{
                                        width: `${passwordStrength}%`
                                    }}
                                ></div>
                            </div>
                            <div className="text-xs mt-1 text-white">
                                {passwordStrength < 40
                                    ? 'Weak Password'
                                    : passwordStrength < 70
                                    ? 'Medium Password'
                                    : 'Strong Password'}
                            </div>
                            <div className="text-xs mt-1 text-gray-300">
                                <div className={`${isUpperCase && 'text-green-500'}`}><i className={`${isUpperCase ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 1 Uppercase Letter</span></div>
                                <div className={`${isLowerCase && 'text-green-500'}`}><i className={`${isLowerCase ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 1 Lowercase Letter</span></div>
                                <div className={`${isCorrectLength && 'text-green-500'}`}><i className={`${isCorrectLength ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 8 Characters Long</span></div>
                                <div className={`${isSpecialChar && 'text-green-500'}`}><i className={`${isSpecialChar ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 1 Special Character</span></div>
                                <div className={`${isNumber && 'text-green-500'}`}><i className={`${isNumber ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 1 Number</span></div>
                            </div>
                        </div>
                    )}
                    <LoginInput
                        addMainClass="mt-2"
                        placeholder="Confirm your Password"
                        title="Confirm Password"
                        value={data.confirm_password}
                        name="confirm_password"
                        type={isChecked ? 'text' : 'password'}
                        onError={errors.confirm_password}
                        onChange={handleChange}
                    />
                    <CheckboxWithText
                        id="custom-checkbox"         
                        type="checkbox"             
                        name="exampleCheckbox"      
                        handleClick={handleCheckboxClick} 
                        isChecked={isChecked}        
                        disabled={false}  
                        addMainClass="justify-end mt-2"         
                    />
                    <button 
                        className={`w-full font-open-sans bg-login-btn-color mt-4 text-white p-2 text-xs cursor-pointer rounded-lg text-center font-medium hover:opacity-70 md:text-base md:p-2.5 disabled:cursor-not-allowed `}
                        type="submit"
                        disabled={processing}
                        >
                            {processing ? 'Please Wait' : 'Reset Password'}
                    </button>
                    <p className='text-xs md:text-sm mt-5 text-white '><span>Already know the password?</span> <Link href='/login' className='text-login-btn-color2 font-semibold hover:opacity-70'>Back to Login</Link></p>
                </form>
            </div>
        </>
    );
};

export default ResetPasswordEmail;

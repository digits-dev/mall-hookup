import React, { useState, useEffect } from 'react';
import { usePage, router, Link, Head, useForm } from '@inertiajs/react';
import { useAuth } from '../../Context/AuthContext';
import LoginInput from '../../Components/Forms/LoginInput';
import CheckboxWithText from '../../Components/Checkbox/CheckboxWithText';


const LoginPage = () => {
    const { updateAuth } = useAuth();
    const [isChecked, setIsChecked] = useState(false);
    const { data, setData, processing, reset, post, errors } = useForm({
        email: "",
        password: "",
    });

    const handleCheckboxClick = () => {
        setIsChecked(!isChecked);
    };

    const handleLogin = (e) => {
        e.preventDefault();
         post('post_login', {
            onSuccess: (page) => {
                const newAuthState = page.props.auth;
                updateAuth(newAuthState);

                reset();
            },
            onError: (error) => {
            }
        });
        
    }


    return (
        <>
            <Head title='Login'/>
            <div className="flex flex-col items-center p-5 justify-center w-screen h-screen font-poppins bg-center">
                <img className='w-full h-full absolute' src='/images/login-page/login-bg.jpg'/>
                <img className='w-12 h-12 md:w-16 md:h-16 mb-3 z-50' src='/images/others/digits-icon.png'/>
                <p className='text-white text-md md:text-xl z-50 font-semibold'>Digits Item Masterfile System</p>
                <form onSubmit={handleLogin} className="flex z-50 flex-col m-5 items-center bg-white/20 w-full border border-white/40 rounded-xl shadow-lg p-6 max-w-md">
                    <p className='text-white text-2xl md:text-3xl font-semibold my-4'>Login</p>
                    <LoginInput
                        addMainClass="mt-2"
                        placeholder="Enter Email"
                        title="Email"
                        name="email"
                        type="text"
                        onError={errors.email}
                        onChange={(e) =>setData("email", e.target.value)
                        }
                    />
                    <LoginInput
                        addMainClass="mt-2"
                        placeholder="Enter Password"
                        title="Password"
                        name="password"
                        type={isChecked ? 'text' : 'password'}
                        onError={errors.password}
                        onChange={(e) =>setData("password", e.target.value)
                        }
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
                            {processing ? 'Please Wait' : 'Login'}
                    </button>
                    <p className='text-xs md:text-sm mt-5 text-white '><span>Forgot the password ?</span> <Link href='reset_password' className='text-login-btn-color2 font-semibold hover:opacity-70'>Click here</Link></p>
                </form>
            </div>
        </>
        
    );
};

export default LoginPage;

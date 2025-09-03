import Lottie from 'lottie-react';
import React, { useEffect, useRef, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import AnimationData from '../../../../public/Animations/notice-orange-anim.json';
import { router } from '@inertiajs/react';
import Buttonv2 from '../Table/Buttons/Buttonv2';
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';

const SessionExpire = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const countdownInterval = useRef(null);
    const idleTimerRef = useRef(null);

    const {theme} = useTheme();

    const { sideBarBgColor } = useThemeStyles(theme);

    const logout = () => {
        router.post('/logout');
    };

  const handleOnIdle = () => {
    if (!isDialogOpen) { 
      setIsDialogOpen(true); 
      startCountdown();
    }
  };

  const handleOnActive = () => {
    if (isDialogOpen) {
      resetCountdown(); 
      setIsDialogOpen(false); 
    }
    idleTimerRef.current.reset(); 
  };

  const startCountdown = () => {
    setCountdown(60);
    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          logout(); 
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetCountdown = () => {
    clearInterval(countdownInterval.current);
  };


  useIdleTimer({
    ref: idleTimerRef,
    timeout: 1000 * 60 * 30, //set timer here
    onIdle: handleOnIdle, 
    debounce: 500,
  });

  useEffect(() => {
    return () => {
      clearInterval(countdownInterval.current);
    };
  }, []);


  return (
    <div className={`fixed inset-0 z-100 select-none w-screen font-parkinsans h-screen bg-black/50 flex justify-center items-center duration-100 ease-in ${isDialogOpen ? 'opacity-100' : 'opacity-0  pointer-events-none'}`}>
        <div className={`${theme === 'bg-skin-black' ? ' text-white' : 'text-gray-700'} p-5 md:p-10 ${sideBarBgColor}  max-w-[35rem] w-full m-5 flex flex-col items-center rounded-lg shadow-lg duration-300 ease-in-out ${isDialogOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <Lottie animationData={AnimationData} className='w-full h-full max-w-24 max-h-24 md:max-w-32 md:max-h-32'/>
            <p className="mb-2 font-bold md:text-xl">Session Expiring!</p>
            <p className='text-xs md:text-sm text-gray-500 mb-5'>Your session will expire due to inactivity in</p>
            <p className="font-bold text-2xl md:text-4xl">{countdown}</p>
            <Buttonv2 name="Stay Logged In" addClass="mt-5" onClick={handleOnActive}/>
        </div>
    </div>
  )
}

export default SessionExpire
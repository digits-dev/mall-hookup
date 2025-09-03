import confetti from 'canvas-confetti';
import React, { useEffect, useMemo, useState } from 'react'
import { useTheme } from '../../Context/ThemeContext';
import { Bell, Eye, Info, TriangleAlert, CircleCheckBig, Calendar, ImageIcon, Link, X } from 'lucide-react';
import axios from 'axios';

const AnnouncementModal = ({isOpen, setIsOpen, data, action, isImageEdited}) => {
    const { theme } = useTheme();
    const [imageError, setImageError] = useState(false);

    const [progress, setProgress] = useState(0);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
        updateIsreadSession();
    };

    const objectURL = useMemo(() => {
        if (data?.image && action == 'Create') {
            return URL.createObjectURL(data?.image);
        }

        if (data?.image && action == 'Update') {
            if (isImageEdited){
                return URL.createObjectURL(data?.image);
            }
            else{
                return `../../storage/${data?.image}`;
            }
        }

        if (data?.image && action == 'View') {
            return `../storage/${data?.image}`;
        }

        if (data?.image && action == 'View User') {
            return `../storage/${data?.image}`;
        }

        return null;
    }, [data?.image]);

    const updateIsreadSession = async () => {
        try {
          const response = await axios.post('announcements/update_announcement_isread');
        } catch (error) {
          console.error(error);
        }
    };

    // CONFETTI
    useEffect(() => {
        if (isOpen && data?.confetti_effect) {
            confetti({
                particleCount: 100,
                spread: 300,
                origin: { y: 0.5 },
            });
        }
    }, [isOpen, data?.confetti_effect]);

    // AUTO DISMISS 
    useEffect(() => {
        let interval;
        if (isOpen && data?.auto_dismiss && data?.auto_dismiss_duration) {
            const durationMs = data?.auto_dismiss_duration * 1000;
            let start = Date.now();
            const end = start + durationMs;
    
            interval = setInterval(() => {
                const now = Date.now();
                const newProgress = ((now - start) / durationMs) * 100;
    
                if (newProgress >= 100) {
                    setProgress(100);
                    setIsOpen(false);
                    updateIsreadSession();
                    clearInterval(interval);
                } else {
                    setProgress(newProgress);
                }
            }, 50);
    
            return () => clearInterval(interval);
        }
    }, [isOpen, data?.auto_dismiss, data?.auto_dismiss_duration]);

    // BUTTON CLASS
    const getButtonClasses = (style, theme) => {
        return `
            px-3 py-2 text-sm rounded-md cursor-pointer
            ${style === "Default" ? theme + " text-white hover:opacity-70" : ""}
            ${style === "Secondary" ? (theme === 'bg-skin-blue' ? 'bg-skin-blue-accent text-white hover:opacity-70' : 'bg-skin-black-secondary text-white hover:opacity-70') : ''}
            ${style === "Destructive" ? "bg-red-500 hover:opacity-70 text-white text-destructive-foreground" : ""}
            ${style === "Outline" ? "border border-input" : ""}
            ${style === "Ghost" ? (
                theme === 'bg-skin-blue'
                    ? 'hover:bg-skin-blue-secondary/40 hover:text-white'
                    : 'hover:bg-skin-black/60 hover:text-white'
            ) : ""}
        `;
    };

    // MODAL WIDTH CLASS
    const modalWidhtClass = {
        'Small' : 'max-w-[30rem]',
        'Medium' : 'max-w-[40rem]',
        'Large' : 'max-w-[50rem]',
    }[data?.size];

  return (
    <div className={`fixed inset-0 z-100 select-none w-screen font-parkinsans h-screen bg-black/50 flex justify-center items-center duration-100 ease-in ${isOpen ? 'opacity-100' : 'opacity-0  pointer-events-none'}`}>
      <div className={`${modalWidhtClass} bg-white relative p-5  w-full m-5 rounded-lg shadow-lg duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} flex flex-col items-center px-5 py-7`}>
            {data?.auto_dismiss && data?.auto_dismiss_duration && (
                <div className={`absolute top-0 left-0 h-1 ${theme} rounded-t-md`}
                    style={{
                        width: `${progress}%`,
                        transition: 'width 50ms linear',
                    }}
                />
            )}
            {data?.close_button && 
                <div className='absolute top-3 right-3 hover:bg-red-200 p-1 rounded-full hover:text-red-500 cursor-pointer' onClick={()=>handleButtonClick()}>
                    <X className='w-4 h-4'/>
                </div>
            }
            
            <div className='flex items-center space-x-2'>
                {data?.variant == 'Default' && <Bell className='w-5 h-5 text-black'/>}
                {data?.variant == 'Info' && <Info className='w-5 h-5 text-blue-500'/>}
                {data?.variant == 'Warning' && <TriangleAlert className='w-5 h-5 text-yellow-500'/>}
                {data?.variant == 'Success' && <CircleCheckBig className='w-5 h-5 text-green-500'/>}
                {data?.variant == 'Event' && <Calendar className='w-5 h-5 text-violet-500'/>}
                <p className='font-medium'>{data?.title}</p>
                {data?.show_new_badge && <p className={`${theme} text-white font-semibold text-xs px-2 py-0.5 rounded-full`}>New</p>}
            </div>
            {data?.image && !imageError ? (
                <img
                className="w-full h-32 mt-6 object-contain"
                id="image"
                src={objectURL}
                alt="Selected"
                type="image/gif"
                onError={() => setImageError(true)}
                />
            ) : data?.image && imageError ? (
                <div className="w-full h-24 mt-4 text-white bg-gray-300 rounded-md mb-3 overflow-hidden">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="h-6 w-6 mr-2" />
                    <span>Image Preview</span>
                </div>
                </div>
            ) : null}
            <p className={`text-xs mt-7 max-h-56 overflow-y-auto whitespace-pre-line ${data?.description_center && 'text-center'}`}>
                {data?.description}
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center mt-6">
                {
                    data?.actions.map((action, index) => {
                        const classNames = getButtonClasses(action.style, theme);

                        if (action.type == 'Dismiss') {
                            return  <div
                                        key={index}
                                        onClick={()=> handleButtonClick()}
                                        className={classNames}
                                        >
                                            {action.label}
                                    </div>
                        }
                        else {
                            return  <a
                                        href={action.url}
                                        key={index}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handleButtonClick}
                                        className={classNames}
                                    >
                                        {action.label}
                                    </a>
                        }

                    }
                       
                    )
                }
                {}
            </div>
      </div>
    </div>
  )
}

export default AnnouncementModal
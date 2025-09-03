import React, { useRef, useState } from 'react'
import { useTheme } from '../../Context/ThemeContext';

const EmbeddedDashboardViewModal = ({url}) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const iframeRef = useRef(null);

    const handleBackdropClick = (e) => {
      if (iframeRef.current && !iframeRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
   return (
    <>
    <button className={`${theme} text-xs text-white mr-5 px-3 py-1 rounded-lg hover:opacity-70`} onClick={()=>setIsOpen(true)}>View Dashboard</button>
    {isOpen && 
        <div onClick={handleBackdropClick} className={`fixed inset-0 z-100 select-none w-screen font-parkinsans h-screen bg-black/50 flex justify-center items-center duration-100 ease-in ${isOpen ? 'opacity-100' : 'opacity-0  pointer-events-none'}`}>
                <iframe
                    ref={iframeRef}
                    title="IT Ops Dashboard"
                    style={{ top: 0, left: 0, width: '60%', height: '70%' }}
                    src={url}
                    frameBorder="0"
                    allowFullScreen={true}
                ></iframe>
        </div>
    }
    </>
  )
}

export default EmbeddedDashboardViewModal
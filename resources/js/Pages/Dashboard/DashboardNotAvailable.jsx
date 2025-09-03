import React from 'react'
import ContentPanel from '../../Components/Table/ContentPanel'
import EmptyAnim from '../../../../public/Animations/empty-anim.json';
import Lottie from 'lottie-react'
import { useTheme } from '../../Context/ThemeContext'

const DashboardNotAvailable = () => {
    const { theme } = useTheme();
  return (
    <ContentPanel>
        <div className='flex flex-col items-center justify-center border-2 border-dashed py-20 rounded-lg'>
            <Lottie animationData={EmptyAnim} className='w-96 h-auto'/>
            <p className={`${theme === 'bg-skin-black' ? 'text-gray-400': 'text-skin-blue-secondary'} font-bold text-2xl`}>Dashboard Not Available</p>
            <p className='text-sm mt-1 text-gray-500'>Please Contact the System Administrator for Assistance</p>
        </div>
    </ContentPanel>
  )
}

export default DashboardNotAvailable
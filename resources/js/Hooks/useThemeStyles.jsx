const useThemeStyles = (theme) => {

    const styles = {
        textColor: {
            'bg-skin-blue': 'text-black',
            'bg-skin-black': 'text-gray-300',
        },
        textColorActive: {
            'bg-skin-blue': 'text-white',
            'bg-skin-black': 'text-gray-400',

        },
        bgColor: {
            'bg-skin-blue': 'bg-white',
            'bg-skin-black': 'bg-white',
        
        },
        borderColor: {
            'bg-skin-blue': 'border-white',
            'bg-skin-black': 'border-gray-400',
        
        },
        tooltipColor: {
            "skin-blue": "bg-skin-blue-light",
            "skin-black": "bg-skin-black-light",
   
        },
        arrwoTooltipColor: {
            'skin-blue': '#508C9B',
            'skin-black': '#31363F',
       
        },
        buttonSwalColor: {
            'bg-skin-blue': '#134B70',
            'bg-skin-black': '#322C2B',
      
        },
        paginationHoverColor: {
            "bg-skin-blue": "hover:bg-skin-blue-light",
            "bg-skin-black": "hover:bg-skin-black-light",
           
        },
        hoverColor: {
            "bg-skin-blue": "hover:bg-skin-blue",
            "bg-skin-black": "hover:bg-skin-black-hover",
     
        },
        primayActiveColor: {
            "bg-skin-blue": "bg-skin-blue-light",
            "bg-skin-black": "bg-skin-white",
    
        },
        paginationSideActiveColor: {
            "bg-skin-blue": "bg-skin-blue-light",
            "bg-skin-black": "bg-skin-black-light",
        
        },
        borderTheme: {
            'bg-skin-blue': 'border-skin-blue-secondary',
            'bg-skin-black': 'border-gray-300',
    
        },
        secondaryHoverBorderTheme: {
            'bg-skin-blue': 'hover:border-teal-500',
            'bg-skin-black': 'hover:border-black',
  
        },

        calendarDateTimeColor: {
            'bg-skin-blue': 'bg-skin-white-light',
            'bg-skin-black': 'bg-skin-black-hover',

        },

        iconThemeColor : {
            'bg-skin-blue': 'text-sky-900',
            'bg-skin-black': 'text-gray-400',
    
        },
        scrollbarTheme: {
            'bg-skin-blue': 'scrollbar-thumb-sky-900',
            'bg-skin-black': 'scrollbar-thumb-gray-900',
      
        },

        bulkActionTextColor: {
            'bg-skin-blue': 'text-skin-blue-secondary',
            'bg-skin-black': 'text-gray-300',
        
        },


        bulkActionCancelButtonColor: {
            'bg-skin-blue': 'bg-gray-200',
            'bg-skin-black': 'bg-gray-200',
         
        },

        // SIDEBAR

        sidebarHoverTextColor: {
            'bg-skin-blue': 'hover:text-white',
            'bg-skin-black': 'hover:text-white',
        },
        sidebarHoverMenuBgColor: {
            'bg-skin-blue': 'hover:bg-skin-blue',
            'bg-skin-black': 'hover:bg-skin-black',
     
        },
        sidebarHoverMenuBorderColor: {
            'bg-skin-blue': 'hover:border-skin-blue-light',
            'bg-skin-black': 'hover:border-skin-black-light',
     
        },

        sidebarActiveTextColor: {
            'bg-skin-blue': 'text-white',
            'bg-skin-black': 'text-white',
     
        },
        sidebarActiveMenuBgColor: {
            'bg-skin-blue': 'bg-skin-blue',
            'bg-skin-black': 'bg-skin-black',
     
        },
        sidebarActiveMenuBorderColor: {
            'bg-skin-blue': 'border-skin-blue-light',
            'bg-skin-black': 'border-skin-black-light',
     
        },
        sidebarBorderColor: {
            'bg-skin-blue': 'border-white',
            'bg-skin-black': 'border-black-table-color',
        },

        sideBarTextColor: {
            'bg-skin-blue': 'text-gray-600',
            'bg-skin-black': 'text-white',
        },

        sideBarBgColor: {
            'bg-skin-blue': 'bg-white',
            'bg-skin-black': 'bg-black-table-color',
        },

        pageTitle: {
            'bg-skin-blue': 'text-black/90',
            'bg-skin-black': 'text-white/90',
        },

        pageSubTitle: {
            'bg-skin-blue': 'text-gray-500',
            'bg-skin-black': 'text-gray-400',
        },


      

    };

    return {
        textColor: styles.textColor[theme],
        textColorActive: styles.textColorActive[theme],
        sideBarTextColor: styles.sideBarTextColor[theme],
        sidebarHoverTextColor: styles.sidebarHoverTextColor[theme],
        bgColor: styles.bgColor[theme],
        borderColor: styles.borderColor[theme],
        tooltipColor: styles.tooltipColor[theme],
        arrwoTooltipColor: styles.arrwoTooltipColor[theme],
        buttonSwalColor: styles.buttonSwalColor[theme],
        paginationHoverColor: styles.paginationHoverColor[theme],
        primayActiveColor: styles.primayActiveColor[theme],
        paginationSideActiveColor: styles.paginationSideActiveColor[theme],
        hoverColor: styles.hoverColor[theme],
        borderTheme: styles.borderTheme[theme],
        secondaryHoverBorderTheme: styles.secondaryHoverBorderTheme[theme],
        calendarDateTimeColor: styles.calendarDateTimeColor[theme],
        iconThemeColor: styles.iconThemeColor[theme],
        scrollbarTheme: styles.scrollbarTheme[theme],
        bulkActionTextColor: styles.bulkActionTextColor[theme],
        bulkActionCancelButtonColor: styles.bulkActionCancelButtonColor[theme],
        sideBarBgColor: styles.sideBarBgColor[theme],
        sidebarHoverMenuBgColor: styles.sidebarHoverMenuBgColor[theme],
        sidebarHoverMenuBorderColor: styles.sidebarHoverMenuBorderColor[theme],
        sidebarActiveTextColor: styles.sidebarActiveTextColor[theme],
        sidebarActiveMenuBgColor: styles.sidebarActiveMenuBgColor[theme],
        sidebarActiveMenuBorderColor: styles.sidebarActiveMenuBorderColor[theme],
        sidebarBorderColor: styles.sidebarBorderColor[theme],
        pageTitle: styles.pageTitle[theme],
        pageSubTitle: styles.pageSubTitle[theme],
    };
};

export default useThemeStyles;

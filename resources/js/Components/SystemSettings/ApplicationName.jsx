import axios from "axios";

const getAppName = async () => {
    // try {
    //     const response = await axios.get('/appname');
    //     if(response.data.app_name){
    //         return response.data.app_name;
    //     }else{
    //         return 'DIMFS';
    //     }
    // } catch (error) {
    //     console.error('Error fetching app name:', error);
    return "MALL HOOKUP";
    // }
};

export default getAppName;

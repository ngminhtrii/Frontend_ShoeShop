import { axiosInstance } from "../utils/axiosIntance";


export const authenticateApi = {
    login: async () => {
        return axiosInstance.post(`/api/v1/demo`,)
            
    },
    
    register: async () => {
        return axiosInstance.post(`api/v1/demo`, );
    },
    logout: async () => {
        return axiosInstance.get(`/api/v1/demo`);
    },
};

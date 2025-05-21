import { axiosInstanceAuth } from "../utils/axiosIntance";

export const inforApi = {
  getProfile: () =>
    axiosInstanceAuth.get("http://localhost:5005/api/v1/users/Profile"),
};

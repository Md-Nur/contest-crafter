import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthProvider";
import { signOut } from "firebase/auth";

const axiosNormal = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const useAxiosNormal = () => {
  return axiosNormal;
};

// This route will help the jwt token to be sent to the server vaia cookie

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const useAxiosSecure = () => {
  // const navigate = useNavigate();
  const { setLoading } = useUserAuth();

  // request interceptor to add authorization header for every secure call to teh api
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access-token");
      // console.log('request stopped by interceptors', token)
      config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // intercepts 401 and 403 status
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error.response.status;
      // console.log('status error in the interceptor', status);
      // for 401 or 403 logout the user and move the user to the login
      if (status === 401 || status === 403) {
        setLoading(true);
        await signOut();
        setLoading(false);
        // navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

// export default useAxiosSecure;

export default useAxiosNormal;

import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase/config";
import { createContext, useContext, useEffect, useState } from "react";
import useAxiosNormal, { useAxiosSecure } from "../hook/axios";
import Swal from "sweetalert2";

const UserAuth = createContext({
  userAuth: {
    displayName: "",
    email: "",
    photoURL: "",
  },
  loading: null,
  setUserAuth: () => {},
});

const UserAuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState();
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const axiosNormal = useAxiosNormal();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        // console.log(user);
        axiosNormal
          .get(`/users/${user.uid}`)
          .then((res) => {
            // console.log(res.data);
            setUserAuth(res.data);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // TODO: remove token (if token stored in the client side: Local storage, caching, in memory)
        localStorage.removeItem("access-token");
        setLoading(false);
      }
    });
    return () => {
      return unsubscribe();
    };
  }, [axiosNormal]);

  return (
    <UserAuth.Provider value={{ userAuth, setUserAuth, loading, setLoading }}>
      {children}
    </UserAuth.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(UserAuth);
};

export default UserAuthProvider;

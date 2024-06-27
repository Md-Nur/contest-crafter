import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase/config";
import Swal from "sweetalert2";
import { useUserAuth } from "../contexts/UserAuthProvider";
import useAxiosNormal from "../hook/axios";
import { useLocation, useNavigate } from "react-router-dom";

const GooglePopup = ({ title }) => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const { setUserAuth, setLoading } = useUserAuth();
  const axiosNormal = useAxiosNormal();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePopup = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        if (title === "Login") {
          axiosNormal
            .get(`/users/${user.uid}`)
            .then((res) => {
              axiosNormal
                .post("/jwt", res.data)
                .then((jwtRes) => {
                  localStorage.setItem("access-token", jwtRes.data.token);
                  setUserAuth(res.data);
                  Swal.fire({
                    icon: "success",
                    title: "Logged in successfully",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  navigate(location.state || "/");
                  setLoading(false);
                })
                .catch((error) => {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                  });
                });
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
              });
            });
        } else if (title === "SignIn") {
          axiosNormal
            .post("/users", {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              isAdmin: false,
              isCreator: false,
              participateContests: [],
              winningContests: [],
              submission: [],
            })
            .then((res) => {
              axiosNormal
                .post("/jwt", res.data)
                .then((jwtRes) => {
                  localStorage.setItem("access-token", jwtRes.data.token);
                  setUserAuth(res.data);
                  Swal.fire({
                    icon: "success",
                    title: "Signed in successfully",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  navigate(location.state || "/");
                  setLoading(false);
                })
                .catch((error) => {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                  });
                });
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
              });
            });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  };

  return (
    <button onClick={handlePopup} className="btn btn-primary">
      {title} with Google
    </button>
  );
};

export default GooglePopup;

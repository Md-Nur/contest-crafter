import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/config";
import Swal from "sweetalert2";
import { useUserAuth } from "../contexts/UserAuthProvider";
import useAxiosNormal from "../hook/axios";
import GooglePopup from "../components/GooglePopup";
import { useEffect, useState } from "react";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

const Register = () => {
  const { register, handleSubmit } = useForm();
  const auth = getAuth(app);
  const { userAuth, setUserAuth, setLoading } = useUserAuth();
  const navigate = useNavigate();
  const axiosNormal = useAxiosNormal();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    loadCaptchaEnginge(6);
    if (userAuth) {
      Swal.fire({
        icon: "info",
        title: "You are already logged in",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);

    Swal.fire({
      title: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const imgData = new FormData();
      imgData.append("image", data.photoURL[0]);

      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const imgURL = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        imgData
      );
      const userData = {
        ...data,
        photoURL: imgURL.data.data.url,
      };

      await updateProfile(auth.currentUser, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      });

      const ownUser = await axiosNormal.post("/users", {
        uid: user.user.uid,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        isAdmin: false,
        isCreator: false,
        participateContests: [],
        winningContests: [],
      });

      const jwt = await axiosNormal.post("/jwt", ownUser.data);

      if (jwt.data.token) {
        localStorage.setItem("access-token", jwt.data.token);
        setLoading(false);
      }

      Swal.fire({
        icon: "success",
        title: "User created successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setUserAuth(ownUser.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  const handleValidateCaptcha = (e) => {
    const user_captcha_value = e.target.value;
    if (validateCaptcha(user_captcha_value)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center w-full h-full mb-10">
      <h2 className="text-center text-5xl font-bold">Register</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-body w-auto px-1 my-5 border border-base-content rounded-xl bg-base-200"
      >
        <div className="overflow-x-auto ">
          <table className="table">
            <tbody className="">
              <tr>
                <th>
                  <label className="label">
                    <LoadCanvasTemplate />
                  </label>
                </th>
                <td>
                  <input
                    onBlur={handleValidateCaptcha}
                    type="text"
                    name="captcha"
                    placeholder="type the captcha above"
                    className="input input-bordered"
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                </th>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    className="input input-bordered w-full"
                    required
                    {...register("displayName")}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                </th>
                <td>
                  <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    required
                    {...register("email")}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label className="label">
                    <span className="label-text">Avatar</span>
                  </label>
                </th>
                <td>
                  <input
                    type="file"
                    placeholder="Photo URL"
                    className="file-input file-input-bordered w-full"
                    required
                    {...register("photoURL")}
                  />
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                </th>
                <td>
                  <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full"
                    required
                    {...register("password")}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="form-control mt-6">
            <button
              disabled={disabled}
              type="submit"
              className="btn btn-primary w-20 mx-auto"
            >
              Sign In
            </button>
          </div>
        </div>
      </form>
      <label className="label text-xl justify-start gap-2">
        Already have an account?
        <Link to="/login" className="link-hover">
          Login
        </Link>
      </label>
      <div className="divider">Or</div>
      <GooglePopup title={"SignIn"} />
    </section>
  );
};

export default Register;

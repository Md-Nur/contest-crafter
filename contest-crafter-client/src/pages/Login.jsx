import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthProvider";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase/config";
import useAxiosNormal from "../hook/axios";
import GooglePopup from "../components/GooglePopup";
import { useEffect, useState } from "react";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { userAuth, setUserAuth, setLoading } = useUserAuth();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const location = useLocation();
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
      return <Navigate to="/" />;
    }
  }, []);

  const onSubmit = async (data) => {
    Swal.fire({
      title: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // console.log(user);
      const mUser = await axiosNormal.get(`/users/${user.user.uid}`);
      const jwt = await axiosNormal.post("/jwt", mUser.data);

      // console.log(mUser);

      if (jwt.data.token) {
        localStorage.setItem("access-token", jwt.data.token);
        setLoading(false);
      }

      setUserAuth(mUser.data);
      Swal.fire({
        icon: "success",
        title: "Logged in successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(location?.state || "/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 5500,
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
    <section className="flex flex-col items-center justify-center w-full h-full">
      <h2 className="text-center text-xl md:text-5xl font-bold">Login</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-body w-auto px-1 my-5 border border-base-content rounded-xl bg-base-200"
      >
        <div className="overflow-x-auto ">
          <table className="table">
            <tbody className="">
              {/* row 1 */}
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
                    <span className="label-text">Email</span>
                  </label>
                </th>
                <td>
                  <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered"
                    required
                    {...register("email")}
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
                    className="input input-bordered"
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
              className="btn btn-primary w-20 mx-auto"
            >
              Login
            </button>
          </div>
        </div>
      </form>
      <label className="label text-xl justify-start gap-2">
        Don't have an account?
        <Link to="/register" className="link-hover">
          Register
        </Link>
      </label>
      <div className="divider">Or</div>
      <GooglePopup title={"Login"} />
    </section>
  );
};

export default Login;

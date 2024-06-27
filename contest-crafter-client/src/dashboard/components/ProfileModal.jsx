import { useForm } from "react-hook-form";
import useAxiosNormal, { useAxiosSecure } from "../../hook/axios";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import Swal from "sweetalert2";
import axios from "axios";
import { getAuth, updateProfile } from "firebase/auth";
import app from "../../firebase/config";

const ProfileModal = () => {
  const { handleSubmit, register } = useForm();
  const { userAuth, setUserAuth, setLoading } = useUserAuth();
  const axiosSecure = useAxiosSecure();
  const axiosNormal = useAxiosNormal();

  const auth = getAuth(app);

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
      let userData = {
        ...data,
      };
      try {
        const imgData = new FormData();
        imgData.append("image", data.photoURL[0]);

        const imgURL = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_API_KEY
          }`,
          imgData
        );
        userData.photoURL = imgURL.data.data.url;
      } catch (error) {
        userData.photoURL = userAuth.photoURL;
      }

      await updateProfile(auth.currentUser, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      });

      const ownUser = await axiosSecure.put(`/users/${userAuth._id}`, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        address: userData.address,
      });

      const jwt = await axiosNormal.post("/jwt", {
        ...userAuth,
        displayName: ownUser.data.displayName,
        photoURL: ownUser.data.photoURL,
        address: ownUser.data.address,
      });

      if (jwt.data.token) {
        localStorage.removeItem("access-token");
        localStorage.setItem("access-token", jwt.data.token);
      }
      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "User Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setUserAuth(ownUser.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };
  return (
    <dialog id="update_profile_modal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg text-center">Update You Profile</h3>
        <div className="modal-action">
          <form
            className="card-body"
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-control">
              <input
                type="text"
                placeholder="You Name"
                className="input input-bordered"
                defaultValue={userAuth.displayName}
                {...register("displayName")}
              />
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="Address"
                className="input input-bordered"
                defaultValue={userAuth?.address}
                {...register("address")}
              />
            </div>
            <div className="form-control">
              <input
                type="file"
                placeholder="Photo URL"
                className="file-input file-input-bordered w-full"
                {...register("photoURL")}
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Update</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ProfileModal;

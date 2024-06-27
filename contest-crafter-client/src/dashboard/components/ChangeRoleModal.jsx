import { useForm } from "react-hook-form";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useAxiosSecure } from "../../hook/axios";

const ChangeRoleModal = ({ id, children, setQueryId }) => {
  const { userAuth } = useUserAuth();
  const axiosSecure = useAxiosSecure();
  const { handleSubmit, register } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.put(`/users-admin/${id}`, {
        role: data.role,
      });
      // refetch the data
      setQueryId(res.data);
      // close the modal
      document.getElementById(`update_role_${id}`).close();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-info btn-sm"
        onClick={() => document.getElementById(`update_role_${id}`).showModal()}
        disabled={userAuth._id === id}
      >
        {children}
      </button>
      <dialog id={`update_role_${id}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Change Role</h3>

          <form method="dialog" onSubmit={handleSubmit(onSubmit)}>
            <select
              {...register("role")}
              id="role"
              className="select select-bordered w-full max-w-xs"
              defaultValue={
                children === "Admin"
                  ? "admin"
                  : children === "Creator"
                  ? "creator"
                  : "user"
              }
            >
              <option value="user">User</option>
              <option value="creator">Creator</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-info">Update</button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ChangeRoleModal;

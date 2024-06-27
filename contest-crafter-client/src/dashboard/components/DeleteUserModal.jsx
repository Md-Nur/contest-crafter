import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useAxiosSecure } from "../../hook/axios";

const DeleteUserModal = ({ children, id, setQueryId }) => {
  const { userAuth } = useUserAuth();
  const axiosSecure = useAxiosSecure();
  
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.delete(`/users/${id}`);
      // refetch the data
      setQueryId(res.data);
      // close the modal
      document.getElementById(`delete_user_${id}`).close();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-error btn-sm"
        onClick={() => document.getElementById(`delete_user_${id}`).showModal()}
        disabled={userAuth._id === id}
      >
        {children}
      </button>
      <dialog id={`delete_user_${id}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Are you sure!</h3>
          <p className="py-4">
            Are you sure you want to delete this user? This action can't be
            undone.
          </p>
          <form method="dialog" onSubmit={handleDelete}>
            <button className="btn btn-error">Delete</button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default DeleteUserModal;

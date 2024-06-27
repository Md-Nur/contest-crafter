import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useAxiosSecure } from "../../hook/axios";

const BlockUserModal = ({ children, id, setQueryId }) => {
  const { userAuth } = useUserAuth();
  const axiosSecure = useAxiosSecure();

  const handleBlock = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.patch(`/users-block/${id}`);
      // refetch the data
      setQueryId(res.data);
      // close the modal
      document.getElementById(`block_user_${id}`).close();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-warning btn-sm"
        onClick={() => document.getElementById(`block_user_${id}`).showModal()}
        disabled={userAuth._id === id}
      >
        {children}
      </button>
      <dialog id={`block_user_${id}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Are you sure!</h3>
          <p className="py-4">
            Are you sure you want to {children} this user? This action can't be
            undone.
          </p>
          <form method="dialog" onSubmit={handleBlock}>
            <button className="btn btn-warning">{children}</button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default BlockUserModal;

import Swal from "sweetalert2";
import { useAxiosSecure } from "../../hook/axios";
import { useUserAuth } from "../../contexts/UserAuthProvider";

const DeleteContest = ({ id, setQueryId = () => {} }) => {
  const axiosSecure = useAxiosSecure();
  const { setUserAuth, setLoading } = useUserAuth();
  const handleDelete = async (e) => {
    Swal.fire({
      title: "Deleting contest",
      text: "Please wait...",
      icon: "info",
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);

    try {
      const { data } = await axiosSecure.delete(`/contest/${id}`);
      //   document.getElementById("delete_contest").closeModal();
      if (data) {
        Swal.fire({
          title: "Success",
          text: "Contest deleted successfully",
          icon: "success",
        });
        setUserAuth(data);
        setQueryId(data);
      }
    } catch (error) {
      Swal.fire({
        title: "Error ...",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-error btn-sm"
        onClick={() =>
          document.getElementById(`delete_contest_${id}`).showModal()
        }
      >
        Delete
      </button>
      <dialog id={`delete_contest_${id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Do you really want to delete this contest?
          </h3>
          <p className="py-4">This process cannot be undone.</p>

          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-error" onClick={handleDelete}>
              Delete
            </button>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default DeleteContest;

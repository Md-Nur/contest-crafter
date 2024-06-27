import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useAxiosSecure } from "../../hook/axios";

const ConfirmContestModal = ({ id, setQueryId, info }) => {
  const axiosSecure = useAxiosSecure();

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.patch(`/confirm-contest/${id}`);
      // refetch the data
      setQueryId(res.data);
      // close the modal
      document.getElementById(`confirm_contest_${id}`).close();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-warning btn-sm"
        onClick={() =>
          document.getElementById(`confirm_contest_${id}`).showModal()
        }
        disabled={info !== "pending"}
      >
        {info === "pending" ? "Approve" : "Approved"}
      </button>
      <dialog id={`confirm_contest_${id}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Are you sure!</h3>
          <p className="py-4">
            Are you sure you want to approve this contest? This action can't be
            undone.
          </p>
          <form method="dialog" onSubmit={handleConfirm}>
            <button className="btn btn-warning">Approve</button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ConfirmContestModal;

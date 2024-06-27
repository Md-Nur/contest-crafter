import { useForm } from "react-hook-form";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useAxiosSecure } from "../../hook/axios";

const CommentContest = ({ id, setQueryId, info }) => {
  const { userAuth } = useUserAuth();
  const axiosSecure = useAxiosSecure();
  const { handleSubmit, register } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.put(`/contest-comment/${id}`, {
        comment: data.comment,
      });
      // refetch the data
      setQueryId(res.data);
      // close the modal
      document.getElementById(`update_comment_${id}`).close();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-info btn-sm"
        onClick={() =>
          document.getElementById(`update_comment_${id}`).showModal()
        }
        disabled={info !== "pending"}
      >
        {info === "pending" ? "Comment" : "Commented"}
      </button>
      <dialog id={`update_comment_${id}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Comment</h3>

          <form method="dialog" onSubmit={handleSubmit(onSubmit)}>
            <input {...register("comment")} className="input input-bordered" />

            <button className="btn btn-info">Insert</button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default CommentContest;

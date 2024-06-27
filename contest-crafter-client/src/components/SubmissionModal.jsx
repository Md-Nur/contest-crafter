import { useForm } from "react-hook-form";
import { useUserAuth } from "../contexts/UserAuthProvider";
import Swal from "sweetalert2";
import { useAxiosSecure } from "../hook/axios";

const SubmissionModal = ({ contestData }) => {
  const { register, handleSubmit } = useForm();
  const { userAuth } = useUserAuth();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    const submissionData = {
      ...contestData,
    };
    delete submissionData._id;
    if (!submissionData.submission) {
      submissionData.submission = [];
    }
    submissionData.submission.push({
      userId: userAuth._id,
      sumbissionDate: new Date().toISOString().split("T")[0],
      submissionUrl: data.driveUrl,
    });

    try {
      await axiosSecure.put(`/contest/${contestData._id}`, submissionData);
      // console.log(submissionData);
      Swal.fire({
        title: "Success",
        text: "Submission successful",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    } finally {
      document.getElementById(`submission_${contestData._id}`).close();
    }
  };
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-secondary"
        onClick={() =>
          document.getElementById(`submission_${contestData._id}`).showModal()
        }
      >
        Submit Your Task
      </button>
      <dialog id={`submission_${contestData._id}`} className="modal">
        <div className="modal-box">
          <p className="py-4">Give the drive url and submit your task</p>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center"
          >
            <input
              type="url"
              placeholder="Drive URL"
              className="input input-bordered w-full max-w-xs"
              {...register("driveUrl")}
              required
            />
            <button className="btn btn-secondary">Submit</button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default SubmissionModal;

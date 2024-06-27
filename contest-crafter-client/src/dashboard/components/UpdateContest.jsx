import Swal from "sweetalert2";
import { useAxiosSecure } from "../../hook/axios";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useForm } from "react-hook-form";
import { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";

const UpdateContest = ({ contestData }) => {
  const axiosSecure = useAxiosSecure();
  const { setUserAuth, setLoading } = useUserAuth();
  const [startDate, setStartDate] = useState(new Date(contestData.deadline));
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    Swal.fire({
      title: "Updating contest",
      text: "Please wait...",
      icon: "info",
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    const updateData = {
      ...contestData,
      ...data,
      deadline: startDate.toISOString().split("T")[0],
    };
    delete updateData._id;
    if (data.contestImage.length > 0) {
      try {
        const imgData = new FormData();
        imgData.append("image", data.contestImage[0]);

        const imgURL = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_API_KEY
          }`,
          imgData
        );
        updateData.imageUrl = imgURL.data.data.url;
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      }
    }
    try {
      const response = await axiosSecure.put(
        `/contest/${contestData._id}`,
        updateData
      );
      //   document.getElementById("delete_contest").closeModal();
      if (response.data) {
        Swal.fire({
          title: "Success",
          text: "Contest updated successfully",
          icon: "success",
        });
        setUserAuth(response.data);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
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
        className="btn btn-info btn-sm"
        onClick={() =>
          document.getElementById(`edit_contest_${contestData._id}`).showModal()
        }
      >
        Edit
      </button>
      <dialog id={`edit_contest_${contestData._id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Contest</h3>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}

            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-2 flex-col"
          >
            {/* if there is a button in form, it will close the modal */}

            <div className="form-control">
              <input
                type="text"
                placeholder="Contest Name"
                className="input input-bordered"
                {...register("contestName")}
                defaultValue={contestData.contestName}
              />
            </div>
            <div className="form-control">
              <input
                type="file"
                placeholder="Contest Image"
                className="file-input file-input-bordered w-full"
                {...register("contestImage")}
                // defaultValue={contestData.contestImage}
              />
            </div>
            <div className="form-control">
              <textarea
                placeholder="Contest Description"
                className="textarea textarea-bordered"
                {...register("description")}
                defaultValue={contestData.description}
              ></textarea>
            </div>
            <div className="form-control">
              <textarea
                placeholder="Contest Submission Instructions"
                className="textarea textarea-bordered"
                {...register("submissionInstructions")}
                defaultValue={contestData.submissionInstructions}
              ></textarea>
            </div>
            <div className="form-control">
              <select
                className="select select-bordered"
                {...register("prizeType")}
                defaultValue={contestData.prizeType}
              >
                <option disabled>Prize Type</option>
                <option value="Prize Money">Prize Money</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="Prize Amount"
                className="input input-bordered"
                {...register("prizeAmount")}
                defaultValue={contestData.prize.amount}
              />
            </div>
            <div className="form-control">
              <select
                className="select select-bordered"
                {...register("contestType")}
                defaultValue={contestData.contestType}
              >
                <option disabled>Contest Type</option>
                <option value="Image Design Contests">
                  Image Design Contests
                </option>
                <option value="Article Writing">Article Writing</option>
                <option value="Marketing Strategy">Marketing Strategy</option>
                <option value="Digital advertisement Contests">
                  Digital advertisement Contests
                </option>
                <option value="Gaming Review">Gaming Review</option>
                <option value="Book Review">Book Review</option>
                <option value="Business Idea Concerts">
                  Business Idea Concerts
                </option>
                <option value="Movie Review">Movie Review</option>
              </select>
            </div>
            <div className="form-control">
              <input
                type="number"
                placeholder="Registration Fee"
                className="input input-bordered"
                {...register("regFee")}
                defaultValue={contestData.regFee}
              />
            </div>
            <div className="form-control">
              <DatePicker
                placeholderText="Deadline"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control mt-6 col-span-2 items-center">
              <button className="btn btn-primary w-40">Update Contest</button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default UpdateContest;

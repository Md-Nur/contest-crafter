import { useForm } from "react-hook-form";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useAxiosSecure } from "../../hook/axios";
const AddContest = () => {
  const [startDate, setStartDate] = useState();
  const { register, handleSubmit } = useForm();
  const { userAuth } = useUserAuth();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    Swal.fire({
      title: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    if (!startDate) {
      Swal.fire({
        title: "Error",
        text: "Please select a deadline",
        icon: "error",
      });
      return;
    }
    if (startDate < new Date()) {
      Swal.fire({
        title: "Error",
        text: "Deadline should be a future date",
        icon: "error",
      });
      return;
    }

    if (data.contestImage.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please select a contest image",
        icon: "error",
        button: "Ok",
      });
      return;
    }

    let defaultContest = {
      contestName: data.contestName,
      imageUrl: "",
      description: data.description,
      submissionInstructions: data.submissionInstructions,
      participationCount: 0,
      prize: { amount: data.prizeAmount, type: data.prizeType },
      contestType: data.contestType,
      regFee: data.regFee,
      deadline: startDate.toISOString().split("T")[0],
      creator: {
        name: userAuth.displayName,
        imageUrl: userAuth.photoURL,
        userId: userAuth._id,
      },
      winner: { name: "", imageUrl: "", userId: "" },
      participants: [],
      status: { name: "pending", msg: "" },
      submission: [],
    };

    try {
      const imgData = new FormData();
      imgData.append("image", data.contestImage[0]);

      const imgURL = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        imgData
      );
      defaultContest.imageUrl = imgURL.data.data.url;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
      return;
    }

    try {
      await axiosSecure.post("/contest", defaultContest);

      Swal.fire({
        title: "Success",
        text: "Contest added successfully",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }

    // reset form
    setStartDate(null);
    document.getElementById("contest-form").reset();
  };
  return (
    <section className="w-full">
      <h1 className="text-4xl text-center font-bold my-10">Add Contest</h1>

      <form
        id="contest-form"
        className="card-body grid grid-cols-1 gap-4 lg:grid-cols-2"
        method="dialog"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control">
          <input
            type="text"
            placeholder="Contest Name"
            className="input input-bordered"
            {...register("contestName")}
            required
          />
        </div>
        <div className="form-control">
          <input
            type="file"
            placeholder="Contest Image"
            className="file-input file-input-bordered w-full"
            {...register("contestImage")}
            required
          />
        </div>
        <div className="form-control">
          <textarea
            placeholder="Contest Description"
            className="textarea textarea-bordered"
            {...register("description")}
            required
          ></textarea>
        </div>
        <div className="form-control">
          <textarea
            placeholder="Contest Submission Instructions"
            className="textarea textarea-bordered"
            {...register("submissionInstructions")}
            required
          ></textarea>
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            {...register("prizeType")}
            defaultValue="Prize Type"
            required
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
            required
          />
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            {...register("contestType")}
            defaultValue="Contest Type"
            required
          >
            <option disabled>Contest Type</option>
            <option value="Image Design Contests">Image Design Contests</option>
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
            required
          />
        </div>
        <div className="form-control">
          <DatePicker
            placeholderText="Deadline"
            selected={startDate}
            required
            onChange={(date) => setStartDate(date)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control mt-6 col-span-2 items-center">
          <button className="btn btn-primary w-40">Add Contest</button>
        </div>
      </form>
    </section>
  );
};

export default AddContest;

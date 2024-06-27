import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAxiosSecure } from "../../hook/axios";
import Swal from "sweetalert2";

const SingleContestSubmission = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const submittedContest = useQuery({
    queryKey: ["submittedContest", id],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const { data } = await axiosSecure.get(`/contests-submission/${id}`);
      return data;
    },
  });
  const contest = useQuery({
    queryKey: ["contest", id],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const { data } = await axiosSecure.get(`/contest/${id}`);
      return data;
    },
  });

  const winnerDec = (i) => {
    Swal.fire({
      title: "Loading",
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    axiosSecure
      .post(`/contest-winner-dec`, {
        contestId: contest.data._id,
        winnerId: contest.data.submission[i].userId,
      })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
        Swal.fire({
          icon: "success",
          title: "Winner Declared",
          text: "Winner has been declared successfully",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  //   console.log(contest.data);
  return (
    <section className="w-full h-full">
      <div
        className="hero h-[650px]"
        style={{
          backgroundImage:
            `url(${contest.data?.imageUrl})` ||
            "url('https://picsum.photos/1920/1080')",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-3xl font-bold">
              Submission of: {contest.data?.contestName}
            </h1>
          </div>
        </div>
      </div>
      <h2 className="text-4xl font-bold text-center my-10">
        Submission Details
      </h2>
      <div className="overflow-x-auto my-10">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Sl</th>
              <th>Name</th>
              <th>Email</th>
              <th>Submitted Date</th>
              <th>Submission Url</th>
              <th>Win?</th>
            </tr>
          </thead>
          <tbody>
            {submittedContest.isLoading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              submittedContest.data.map((user, i) => (
                <tr className="hover">
                  <th>{i + 1}</th>
                  <th>{user.displayName}</th>
                  <td>{user.email}</td>
                  <td>{contest.data.submission[i].sumbissionDate}</td>
                  <td>
                    <a
                      href={contest.data.submission[i].submissionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      View Submission
                    </a>
                  </td>
                  <td>
                    {contest.data.winner.userId ? (
                      contest.data.winner.userId === user._id ? (
                        <span className="badge badge-success">Winner</span>
                      ) : (
                        <span className="badge badge-error">Not Winner</span>
                      )
                    ) : (
                      <button
                        onClick={() => winnerDec(i)}
                        className="btn btn-success btn-sm"
                      >
                        Declare Winner
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SingleContestSubmission;

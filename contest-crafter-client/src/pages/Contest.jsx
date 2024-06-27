import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAxiosSecure } from "../hook/axios";
import Timer from "../components/Timer";
import SubmissionModal from "../components/SubmissionModal";
import { useUserAuth } from "../contexts/UserAuthProvider";

const Contest = () => {
  const axiosSecure = useAxiosSecure();
  const params = useParams();
  const location = useLocation();
  location.state = location.pathname;
  const { userAuth } = useUserAuth();

  const contest = useQuery({
    queryKey: ["contest", params.id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contest/${params.id}`);
      return res.data;
    },
  });

  // console.log(contest.data);
  if (contest.isLoading)
    return <span className="loading loading-dots loading-lg"></span>;
  return (
    <section className="w-full">
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
              {contest.data?.contestName}
            </h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-7xl mx-auto p-3 my-10">
        <div className="overflow-x-auto m-3 bg-base-200 rounded p-3">
          <table className="table">
            <tbody>
              {/* row 1 */}
              <tr className="hover">
                <th>Number of Participants</th>
                <td>{contest.data?.participationCount}</td>
              </tr>
              <tr className="hover">
                <th>Prize </th>
                <td>{contest.data?.prize?.amount}</td>
              </tr>
              <tr className="hover">
                <th>Registration Fee </th>
                <td>${contest.data?.regFee}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col bg-base-200 rounded p-3 m-3">
          <h3 className="text-2xl font-bold">Details: </h3>
          <p className="text-md max-w-xl">{contest.data.description}</p>
        </div>
        <div className="flex flex-col bg-base-200 rounded p-3 m-3">
          <h3 className="text-2xl font-bold">Rules: </h3>
          <p className="text-md max-w-xl">
            {contest.data.submissionInstructions}
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center p-3 m-3 bg-base-200 gap-2 rounded">
          <h1 className="text-2xl font-bold text-center w-full">Winner</h1>
          <img
            src={contest.data?.winner.imageUrl}
            alt="winner"
            className="rounded-full h-24 w-24 object-cover"
          />
          <h3 className="text-xl font-bold">{contest.data?.winner.name}</h3>
        </div>
        <div className="flex justify-between items-center gap-3 m-3 p-3">
          <span className="text-2xl font-bold">Times Left: </span>
          <Timer deadline={contest.data?.deadline} />
        </div>
        {new Date(contest.data.deadline).getTime() - new Date().getTime() > 0 &&
        !userAuth?.isBlocked ? (
          contest.data.participants.includes(userAuth._id) ? (
            <SubmissionModal contestData={contest.data} />
          ) : (
            <Link
              to={`/payment/${contest?.data?._id}`}
              className="btn btn-primary m-3 p-3 mt-7"
            >
              Participate
            </Link>
          )
        ) : (
          <span className="font-bold text-xl w-full flex justify-center items-center">
            Contest Ended
          </span>
        )}
      </div>
    </section>
  );
};

export default Contest;

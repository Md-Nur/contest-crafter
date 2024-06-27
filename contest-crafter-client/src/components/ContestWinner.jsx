import { useQuery } from "@tanstack/react-query";
import useAxiosNormal from "../hook/axios";
import { Link } from "react-router-dom";

const ContestWinner = () => {
  const axiosNormal = useAxiosNormal();
  const contestWinner = useQuery({
    queryKey: ["contestWinner"],
    queryFn: async () => {
      const response = await axiosNormal.get("/contest-winner");
      return response.data;
    },
  });

  if (contestWinner.isLoading)
    return <span className="loading loading-dots loading-lg"></span>;
  if (contestWinner.isError) return <p>{contestWinner.error.message}</p>;

  // console.log(contestWinner.data);
  return (
    <div className="my-5 mx-2 max-w-6xl md:mx-auto">
      <h2 className="text-xl lg:text-4xl text-center font-bold mb-5">
        Join our exciting contests!
      </h2>
      <p className="my-1 text-center">
        Be part of a community that has participated in&nbsp;
        {contestWinner?.data?.totalContests || 10}&nbsp; contests so far.
      </p>
      <div className="my-3">
        <div className="flex flex-col md:flex-row items-center justify-evenly my-5">
          <img
            src={contestWinner?.data.imageUrl}
            alt={contestWinner?.data.winner.name}
            className="rounded-xl w-72 h-72 md:w-96 md:h-96 object-cover shadow-xl"
          />
          <div className="flex flex-col gap-3">
            <h3 className="text-lg lg:text-2xl mb-2 text-center font-bold">
              Latest Winner of {contestWinner?.data.contestName}
            </h3>
            <p className="text-md md:text-xl">
              Congratulations to{" "}
              <strong>{contestWinner?.data.winner.name}</strong>
              &nbsp; for winning the latest contest!
            </p>

            <div className="md:stats shadow flex flex-wrap">
              <div className="stat place-items-center">
                <div className="stat-title">Contests</div>
                <div className="stat-value">
                  {contestWinner.data.totalWinners}
                </div>
                <div className="stat-desc">From January 1st to Now</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Participant</div>
                <div className="stat-value text-secondary">
                  {contestWinner.data.totalParticipants}
                </div>
                <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">New Registers</div>
                <div className="stat-value">
                  {contestWinner.data.participationCount}
                </div>
                <div className="stat-desc">↘︎ 90 (14%)</div>
              </div>
            </div>
            <p className="">
              We have celebrated {contestWinner?.data.totalWinners} winners so
              far. You could be next!
            </p>
            <Link
              to={`/contest/${contestWinner?.data._id}`}
              className="btn btn-accent w-24"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestWinner;

import { Link } from "react-router-dom";
import useContests from "../hook/getContests";

const PopularContest = () => {
  const popularContest = useContests(
    "popularContest",
    "limit=6&sort=participationCount&sortOrder=desc"
  );

  return (
    <div className="my-5 lg:my-10 w-full">
      <h1 className="text-xl lg:text-5xl my-5 font-bold text-center">
        Popular Contest
      </h1>
      {popularContest.isError && <p>{popularContest.error.message}</p>}
      <div className="flex gap-1 md:gap-3 lg:gap-5 flex-wrap w-full justify-around items-center p-2 lg:p-5">
        {popularContest.isLoading &&
          [0, 1, 2, 3, 4, 5].map((index) => (
            <div
              className="card w-96 bg-base-300 border border-base-content shadow-xl"
              key={index}
            >
              <figure className="px-10 pt-10">
                <div className="rounded-xl animate-pulse bg-base-content h-48 w-72" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title animate-pulse rounded bg-base-content h-5 w-60"></h2>
                <h2 className="card-title animate-pulse rounded bg-base-content h-5 w-80"></h2>
                <h2 className="card-title animate-pulse rounded bg-base-content h-5 w-40"></h2>
                <p className="animate-pulse w-56"></p>
                <div className="card-actions">
                  <button className="btn btn-primary animate-pulse w-32"></button>
                </div>
              </div>
            </div>
          ))}
        {popularContest.isSuccess &&
          popularContest.data.map((contest) => (
            <div
              className="card w-96 bg-base-300 border-base-content border shadow-xl"
              key={contest._id}
            >
              <figure className="px-10 pt-10">
                <img
                  src={contest.imageUrl}
                  alt={contest.contestName}
                  className="rounded-xl"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{contest.contestName}</h2>
                <span className="badge badge-ghost">
                  Participants: {contest.participationCount}
                </span>
                <p>{contest.description.slice(0, 50)}...</p>
                <div className="card-actions">
                  <Link
                    to={`/contest/${contest._id}`}
                    className="btn btn-primary"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Link
        to="/all-contests"
        className="btn btn-secondary block w-44 pt-4 mx-auto"
      >
        Show All Contests
      </Link>
    </div>
  );
};

export default PopularContest;

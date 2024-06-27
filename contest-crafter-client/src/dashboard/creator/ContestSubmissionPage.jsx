import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useAxiosSecure } from "../../hook/axios";
import { Link } from "react-router-dom";

const ContestSubmissionPage = () => {
  const axiosSecure = useAxiosSecure();
  const { userAuth } = useUserAuth();
  const myContests = useQuery({
    queryKey: ["myContest", userAuth],
    queryFn: async ({ queryKey }) => {
      const [_, userAuth] = queryKey;
      const { data } = await axiosSecure.get(
        `/created-contest/${userAuth._id}`
      );
      return data;
    },
  });
  return (
    <section className="w-full">
      <h1 className="text-4xl text-center font-bold my-10">
        My Contest Submissions
      </h1>
      <div className="overflow-x-auto m-5 p-5">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Sl</th>
              <th>Contest Title</th>
              <th>Prize Type</th>
              <th>Prize Amount</th>
            </tr>
          </thead>
          <tbody>
            {myContests.isLoading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              myContests.data.map((contest, i) => (
                <tr className="hover">
                  <th>{i + 1}</th>
                  <th>
                    <Link to={`/dashboard/contest-submission/${contest._id}`}>
                      {contest.contestName}
                    </Link>
                  </th>
                  <td>{contest.prize.type}</td>
                  <td>$ {contest.prize.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ContestSubmissionPage;

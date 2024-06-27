import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../../hook/axios";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import DeleteContest from "../components/DeleteContest";
import UpdateContest from "../components/UpdateContest";

const MyCreatedContest = () => {
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
  // console.log(myContests.data);
  return (
    <section>
      <h1 className="text-4xl text-center font-bold my-10">
        My Created Contest
      </h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Contest Name</th>
              <th>Deadline</th>
              <th>Participation</th>
              <th>Prize</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {myContests.data?.map((contest) => (
              <tr className="hover" key={contest._id}>
                <th>{contest.contestName}</th>
                <td>{contest.deadline}</td>
                <td>{contest.participationCount}</td>
                <td>{contest.prize.amount}</td>
                <td>{contest.regFee}</td>
                <td>
                  <div className="tooltip" data-tip={contest.status.msg}>
                    <span
                      className={
                        contest.status.name === "pending"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }
                    >
                      {contest.status.name.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td>
                  <DeleteContest id={contest._id} />
                </td>
                <td>
                  <UpdateContest contestData={contest} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyCreatedContest;

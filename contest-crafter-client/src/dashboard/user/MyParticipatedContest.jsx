import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useAxiosSecure } from "../../hook/axios";
import { useState } from "react";

const MyParticipatedContest = () => {
  const { userAuth } = useUserAuth();
  const axiosSecure = useAxiosSecure();

  const [sortingByDate, setSortingByDate] = useState("");
  const constests = useQuery({
    queryKey: ["myParticipatedContest", sortingByDate],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/user-contests/${userAuth._id}?sortingByDate=${sortingByDate}`
      );
      return response.data;
    },
  });
  const handleUpcomingContest = () => {
    setSortingByDate("-1");
  };

  return (
    <section>
      <h1 className="text-4xl font-bold text-center my-10">
        My Participated Contests
      </h1>

      <div className="flex w-full justify-center items-center my-10">
        <button
          onClick={handleUpcomingContest}
          className="btn btn-accent w-56 mx-auto"
        >
          See Upcoming contest
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Image</th>
              <th>Contest Name</th>
              <th>Deadline</th>
              <th>Prize</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {constests.isLoading || constests.isPending ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              constests.data?.map((contest) => (
                <tr>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={contest.imageUrl}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-bold">{contest.contestName}</span>
                  </td>
                  <td>{contest.deadline}</td>
                  <td>{contest.prize.amount}</td>
                  <td>${contest.regFee}</td>
                  <td>
                    <span className="text-green-500 font-bold">Paid</span>
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

export default MyParticipatedContest;

import { useQuery } from "@tanstack/react-query";
import useAxiosNormal, { useAxiosSecure } from "../../hook/axios";
import { Link } from "react-router-dom";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useState } from "react";
import DeleteContest from "../components/DeleteContest";
import ConfirmContestModal from "../components/ConfirmContestModal";
import CommentContest from "../components/CommentContest";

const ManageContest = () => {
  const axiosSecure = useAxiosSecure();
  const [queryId, setQueryId] = useState("");
  const allContest = useQuery({
    queryKey: ["allContest", queryId],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/contests-admin");
      return data;
    },
  });
  if (allContest.isLoading)
    return <span className="loading loading-dots loading-lg"></span>;
  return (
    <section>
      <h1 className="text-center text-4xl font-bold my-10">
        Manage All Contests
      </h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Contest Name</th>
              <th>Creator Name</th>
              <th>Delete</th>
              <th>Confirm</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {allContest.data.map((contest) => (
              <tr className="hover">
                <th>
                  <Link to={`/contest/${contest._id}`}>
                    {contest.contestName}
                  </Link>
                </th>
                <td>{contest.creator.name}</td>
                <td>
                  <DeleteContest id={contest._id} setQueryId={setQueryId} />
                </td>
                <td>
                  <ConfirmContestModal
                    id={contest._id}
                    setQueryId={setQueryId}
                    info={contest.status.name}
                  />
                </td>
                <td>
                  <CommentContest
                    id={contest._id}
                    setQueryId={setQueryId}
                    info={contest.status.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageContest;

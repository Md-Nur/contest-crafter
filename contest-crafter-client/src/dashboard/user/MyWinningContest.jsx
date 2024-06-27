import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "../../contexts/UserAuthProvider";
import { useAxiosSecure } from "../../hook/axios";
import Swal from "sweetalert2";

const MyWinningContest = () => {
  const { userAuth } = useUserAuth();
  const axiosSecure = useAxiosSecure();
  const wContests = useQuery({
    queryKey: ["myWinningContest"],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(`/win-contests/${userAuth._id}`);
        return response.data;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data,
        });
      }
    },
  });
  // console.log(wContests.data);
  return (
    <section>
      <h1 className="text-center my-10 text-4xl font-bold">
        My Winnig Contests ({wContests.data?.length})
      </h1>

      <div className="w-full">
        {wContests.data?.map((contest) => (
          <div
            key={contest._id}
            className="shadow-md rounded-md p-1 md:p-4 flex flex-col lg:flex-row justify-between bg-base-300 m-1 md:m-4 items-center"
          >
            <div className="w-full md:w-1/2 p-2">
              <img
                src={contest.imageUrl}
                alt={contest.contestName}
                className="rounded shadow"
              />
            </div>
            <div className="w-full md:w-1/2 p-2">
              <h2 className="text-2xl font-bold text-center my-5">
                Congratulations {userAuth.displayName} for win the contest
                &nbsp;{contest.contestName}!!
              </h2>
              <p className="text-lg bg-base-100 rounded py-5 font-bold text-center my-5">
                {contest.prize.amount} winning prize for this contest.
              </p>
              <p className="text-lg my-2">{contest.contestDescription}</p>
              <div className="w-auto bg-base-100">
                <p className="text-lg my-2 text-center font-bold">
                  Contest Creator
                </p>
                <div className="flex rounded p-3 gap-2 items-center">
                  <div className="avatar">
                    <div className="w-12 h-12 mask mask-squircle">
                      <img
                        src={contest.creator.imageUrl}
                        alt={contest.imageUrl.name}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold">
                    {contest.creator.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyWinningContest;

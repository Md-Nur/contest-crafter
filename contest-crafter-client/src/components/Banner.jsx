import { useState } from "react";

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosNormal from "../hook/axios";

const Banner = () => {
  const axiosNormal = useAxiosNormal();
  const [searchName, setSearchName] = useState(null);

  const searchContest = useQuery({
    queryKey: ["searchContest", searchName],
    queryFn: async ({ queryKey }) => {
      const [_key, searchName] = queryKey;
      const response = await axiosNormal.get(
        `/contests?search=${searchName || false}`
      );
      return response.data;
    },
  });

  return (
    <div
      className="hero w-full bg-cover bg-center bg-no-repeat h-[650px]"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Contest Crafter</h1>
          <input
            className="w-full input input-primary input-bordered text-base-content"
            type="text"
            placeholder="Search for contests"
            onChange={(e) => setSearchName(e.target.value)}
          />

          {searchContest?.isSuccess && searchName && (
            <ul className="flex w-60 lg:w-80 ml-3 mt-3 rounded-xl overflow-auto flex-col justify-center items-center bg-base-100 gap-5 py-5 absolute">
              {searchContest.data.map((contest) => (
                <li key={contest._id}>
                  <Link
                    to={`/contest/${contest._id}`}
                    className="link link-hover text-base-content"
                  >
                    {contest.contestName}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;

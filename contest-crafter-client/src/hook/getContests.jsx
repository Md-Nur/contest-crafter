import { useQuery } from "@tanstack/react-query";
import useAxiosNormal from "./axios";

const useContests = (queryKey, queryItem = "") => {
  const axiosNormal = useAxiosNormal();

  const contests = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data } = await axiosNormal.get(`/contests?${queryItem}`);
      //   console.log(data);
      return data;
    },
  });

  return contests;
};

export default useContests;

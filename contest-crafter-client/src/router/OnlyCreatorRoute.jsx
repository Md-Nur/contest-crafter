import { useUserAuth } from "../contexts/UserAuthProvider";

const OnlyCreatorRoute = ({ children }) => {
  const { userAuth, loading } = useUserAuth();

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  } else if (!userAuth?.isCreator) {
    return <div>Only creator can access this page</div>;
  }
  return children;
};

export default OnlyCreatorRoute;

import { useUserAuth } from "../contexts/UserAuthProvider";

const OnlyAdminRoute = ({ children }) => {
  const { userAuth, loading } = useUserAuth();
  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  if (!userAuth.isAdmin) return <div>OnlyAdminRoute</div>;
  return children;
};

export default OnlyAdminRoute;

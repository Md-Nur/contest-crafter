import { useUserAuth } from "../contexts/UserAuthProvider";
import ProfileModal from "./components/ProfileModal";

const Profile = () => {
  const { userAuth } = useUserAuth();
  const winPercentage = parseInt(
    (userAuth.winningContests.length / userAuth.participateContests.length) *
      100
  );

  // console.log(userAuth);
  return (
    <section className="w-full">
      <h1 className="text-4xl text-center font-bold my-10">My profile</h1>

      <div className="hero bg-base-200 rounded shadow my-10 w-full">
        <div className="hero-content flex-col lg:flex-row justify-around w-full">
          <img
            src={userAuth.photoURL}
            className="w-96 h-96 rounded-full shadow-2xl object-cover"
          />
          <div className="">
            <h2 className="text-3xl font-bold">{userAuth.displayName}</h2>
            <h3 className="text-2xl font-bold">{userAuth.email}</h3>
            {userAuth.isAdmin && (
              <p className="text-2xl font-bold text-primary">Admin</p>
            )}
            {userAuth.isCreator && (
              <p className="text-2xl font-bold text-primary">Creator</p>
            )}
            <p className="py-6">
              {userAuth.participateContests.length} contests participated
            </p>
            <p className="py-6">
              {userAuth.winningContests.length} contests won
            </p>
            <div className="flex items-center w-full">
              <div className="flex gap-2 md:gap-5 items-center w-full">
                <h2 className="text-2xl font-bold">Winning Percentage</h2>
                <div
                  className="radial-progress bg-primary text-primary-content border-4 border-primary"
                  style={{ "--value": winPercentage }}
                  role="progressbar"
                >
                  {winPercentage}%
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() =>
                document.getElementById("update_profile_modal").showModal()
              }
            >
              Update you profile
            </button>
            <ProfileModal />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;

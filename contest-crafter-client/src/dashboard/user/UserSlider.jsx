import { NavLink } from "react-router-dom";

const UserSlider = () => {
  return (
    <>
      <li>
        <NavLink to="/dashboard/participated-contest">
          My Participated Contest
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/winning-contest">
          My Winning Contest Page
        </NavLink>
      </li>
    </>
  );
};

export default UserSlider;

import { NavLink } from "react-router-dom";
import CreatorSlider from "../creator/CreatorSlider";
import UserSlider from "../user/UserSlider";

const AdminSlider = () => {
  return (
    <>
      <li>
        <NavLink to="/dashboard/manage-user">Manage User</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/manage-contest">Manage Contest</NavLink>
      </li>
      <CreatorSlider />
      {/* <UserSlider /> */}
    </>
  );
};

export default AdminSlider;

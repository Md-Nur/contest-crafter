import React from "react";
import { NavLink } from "react-router-dom";
import UserSlider from "../user/UserSlider";

const CreatorSlider = () => {
  return (
    <>
      <li>
        <NavLink to="/dashboard/add-contest">Add Contest</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/my-created-contest">My Created Contest</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/contest-submission">
          Contest Submitted Page
        </NavLink>
      </li>
      <UserSlider />
    </>
  );
};

export default CreatorSlider;

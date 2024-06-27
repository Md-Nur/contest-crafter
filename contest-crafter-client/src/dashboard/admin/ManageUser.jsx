import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../../hook/axios";
import DeleteUserModal from "../components/DeleteUserModal";
import { useState } from "react";
import ChangeRoleModal from "../components/ChangeRoleModal";
import BlockUserModal from "../components/BlockUserModal";

const ManageUser = () => {
  const [queryId, setQueryId] = useState(null); // [1
  const axiosSecure = useAxiosSecure();
  const allUser = useQuery({
    queryKey: ["allUser", queryId],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users");
      return data;
    },
  });

  if (allUser.isLoading)
    return <span className="loading loading-dots loading-lg"></span>;

  return (
    <section>
      <h1 className="text-center text-4xl font-bold my-10">Manage All User</h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Delete</th>
              <th>Block/Unblock</th>
            </tr>
          </thead>
          <tbody>
            {allUser.data.map((user) => (
              <tr className="hover">
                <th>{user.displayName}</th>
                <td>{user.email}</td>
                <td>
                  <ChangeRoleModal id={user._id} setQueryId={setQueryId}>
                    {user?.isAdmin
                      ? "Admin"
                      : user.isCreator
                      ? "Creator"
                      : "User"}
                  </ChangeRoleModal>
                </td>
                <td>
                  <DeleteUserModal id={user._id} setQueryId={setQueryId}>
                    Delete
                  </DeleteUserModal>
                </td>
                <td>
                  <BlockUserModal id={user._id} setQueryId={setQueryId}>
                    {user?.isBlocked ? "Unblock" : "Block"}
                  </BlockUserModal>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageUser;

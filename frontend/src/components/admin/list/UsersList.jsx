import { styled } from "styled-components";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { userApi } from "../../../features/userApi";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { deleteUserApi } from "../../../features/userApi";

export default function UsersList() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userApi();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  });

  const rows =
    users?.map((user) => ({
      id: user.UserID,
      uName: user.Username,
      uEmail: user.Email,
      uRole: user.Role,
    })) || [];

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "uName", headerName: "Name", width: 200 },
    {
      field: "uEmail",
      headerName: "Email",
      width: 300,
    },
    {
      field: "uRole",
      headerName: "Role",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.row.uRole === "User" ? (
              <User>User</User>
            ) : params.row.uRole === "Admin" ? (
              <Admin>Admin</Admin>
            ) : (
              "error"
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: (params) => {
        return (
          <Actions>
            <Delete onClick={() => handleDeleteUser(params.row.id)}>
              Delete
            </Delete>
            <View onClick={() => history.push(`/user/${params.row.id}`)}>
              View
            </View>
          </Actions>
        );
      },
    },
  ];

  const handleDeleteUser = async (userID) => {
    try {
      await dispatch(deleteUserApi(userID));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ height: 400, width: "85%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </div>
  );
}

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  button {
    border: none;
    outline: none;
    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
`;

const Delete = styled.button`
  background-color: rgb(255, 77, 73);
`;

const View = styled.button`
  background-color: rgb(114, 225, 40);
`;

const Admin = styled.div`
  color: rgb(253, 181, 40);
  background: rgb(253, 181, 40, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const User = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgb(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

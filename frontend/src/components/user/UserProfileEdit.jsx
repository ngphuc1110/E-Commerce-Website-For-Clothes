import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { getUserApi, updateUserApi } from "../../features/userApi";

const UserProfile = () => {
  const UserID = localStorage.getItem("userid");
  const [user, setUser] = useState({
    Username: "",
    Email: "",
    Role: "",
    Password: "",
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        const user = await getUserApi(parseInt(UserID));
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    setLoading(false);
  }, [UserID]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateUserApi(parseInt(UserID), user);
      console.log("User updated successfully");
    } catch (error) {
      console.error(error);
    }
    setUpdating(false);
  };

  return (
    <StyledProfile>
      <ProfileContainer>
        <form onSubmit={handleSubmit}>
          <h3>User Profile</h3>
          {user.Role === "Admin" ? <Admin>Admin</Admin> : <User>User</User>}
          <label htmlFor="Username">Username:</label>
          <input
            type="text"
            id="Username"
            value={user.Username}
            onChange={(e) => setUser({ ...user, Username: e.target.value })}
          />
          <label htmlFor="Email">Email:</label>
          <input
            type="text"
            id="Email"
            value={user.Email}
            onChange={(e) => setUser({ ...user, Email: e.target.value })}
          />
          <label htmlFor="Password">Password:</label>
          <input
            type="password"
            id="Password"
            value={user.Password}
            onChange={(e) => setUser({ ...user, Password: e.target.value })}
          />
          <button>{updating ? "Updating" : "Update Profile"}</button>
        </form>
      </ProfileContainer>
    </StyledProfile>
  );
};

export default UserProfile;

const StyledProfile = styled.div`
  margin: 3rem;
  display: flex;
  justify-content: center;
`;

const ProfileContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: auto;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 5px;
  padding: 2rem;
  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    h3 {
      margin-bottom: 0.5rem;
    }
    label {
      margin-bottom: 0.2rem;
    }
    input {
      margin-bottom: 1rem;
      outline: none;
      border: none;
      border-bottom: 1px solid gray;
    }
  }
`;

const Admin = styled.div`
  color: rgb(253, 181, 40);
  background: rgb(253, 181, 40, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
  margin-bottom: 1rem;
`;

const User = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgb(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
  margin-bottom: 1rem;
`;

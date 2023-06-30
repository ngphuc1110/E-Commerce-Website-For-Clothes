import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import React, { useEffect } from "react";
import { setLoggedIn, setUsername, setRole } from "../features/authSlice";

const NavBar = () => {
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const username = useSelector((state) => state.auth.username);
  const role = useSelector((state) => state.auth.role);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("loggedIn");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedLoggedIn && storedUsername && storedRole) {
      dispatch(setLoggedIn(storedLoggedIn === "true"));
      dispatch(setUsername(storedUsername));
      dispatch(setRole(storedRole));
    }
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    history.push(`/search/${searchTerm}`);
  };

  const handleLogout = () => {
    dispatch(setLoggedIn(false));
    dispatch(setUsername(null));
    dispatch(setRole(null));
    history.push(`/`);
  };

  return (
    <nav className="nav-bar">
      <RightLinks>
        <Link to="/">
          <h2>UmiShop</h2>
        </Link>
        <Link to="/category">
          <h4>Category</h4>
        </Link>
        <Link to="/category/NewArrivals">
          <h4>New Arrivals</h4>
        </Link>
      </RightLinks>
      <LeftLinks>
        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInput type="text" name="search" placeholder="Search" />
          </form>
        </SearchContainer>
        <Link to="/cart">
          <div className="nav-bag">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              fill="currentColor"
              className="bi bi-cart-fill"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <span className="bag-quantity">
              <span>{cartTotalQuantity}</span>
            </span>
          </div>
        </Link>
        {role === "Admin" ? (
          <>
            <Link to="/admin/summary">Admin</Link>
            <Link to="#" onClick={handleLogout}>
              Logout
            </Link>
          </>
        ) : (
          <>
            {isLoggedIn ? (
              <>
                <Link to="/profile/user">{username}</Link>
                <Link to="#" onClick={handleLogout}>
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    class="bi bi-person-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                      fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                  </svg>
                </Link>
              </>
            )}
          </>
        )}
      </LeftLinks>
    </nav>
  );
};

export default NavBar;

const LeftLinks = styled.div`
  display: flex;
  align-items: center;

  .auth-links {
    margin-left: auto;
  }

  a {
    margin-left: 2rem;
  }
`;

const RightLinks = styled.div`
  display: flex;
  align-items: center;

  .auth-links {
    margin-right: auto;
  }

  a {
    margin-right: 2rem;
  }
`;

const SearchInput = styled.input`
  position: relative;
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid gray;
  border-radius: 4px;
  width: 220px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-search' viewBox='0 0 16 16'><path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  form {
    margin-right: 1rem;
  }
`;

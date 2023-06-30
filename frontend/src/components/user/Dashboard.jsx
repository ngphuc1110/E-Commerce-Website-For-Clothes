import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaUser, FaClipboard } from "react-icons/fa";
import { useSelector } from "react-redux";

const Dashboard = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn !== true) return <h1 className="not-found">404 Not Found!</h1>;

  return (
    <div>
      <StyledDashboard>
        <SideNav>
          <h3>Quick Links</h3>
          <NavLinkStyled to="/profile/user" activeClassName="link-active">
            <FaUser />
            User Profile
          </NavLinkStyled>
          <NavLinkStyled to="/profile/orders" activeClassName="link-active">
            <FaClipboard />
            Orders
          </NavLinkStyled>
        </SideNav>
        <Content>{children}</Content>
      </StyledDashboard>
    </div>
  );
};

const StyledDashboard = styled.div`
  display: flex;
  height: 100vh;
`;

const SideNav = styled.div`
  height: calc(100vh - 70px);
  position: fixed;
  overflow-y: auto;
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  h3 {
    margin: 0 0 1rem 0;
    padding: 0;
    text-transform: uppercase;
    font-size: 17px;
  }

  a {
    text-decoration: none;
    margin-bottom: 1rem;
    font-size: 14px;
    display: flex;
    align-items: center;
    font-weight: 700;
  }

  svg {
    margin-right: 0.5rem;
    font-size: 18px;
  }
`;

const NavLinkStyled = styled(NavLink)`
  text-decoration: none;
  margin-bottom: 1rem;
  font-size: 14px;
  color: grey;

  &.link-active {
    color: blue;
    border-left: 3px solid #4b70e2;
    padding-left: 5px;
    border-radius: 2px;
  }
`;
const Content = styled.div`
  margin-left: 200px;
  padding: 2rem 3rem;
  width: 100%;
  overflow: auto;
`;

export default Dashboard;

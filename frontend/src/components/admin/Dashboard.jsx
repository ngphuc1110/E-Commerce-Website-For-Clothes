import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUsers, FaStore, FaClipboard, FaTachometerAlt } from "react-icons/fa";

const Dashboard = ({ children }) => {
  const role = useSelector((state) => state.auth.role);

  if (role !== "Admin") return <h1 className="not-found">Access Denied!</h1>;

  return (
    <div>
      <StyledDashboard>
        <SideNav>
          <h3>Quick Links</h3>
          <NavLinkStyled
            exact
            to="/admin/summary"
            activeClassName="link-active"
          >
            <FaTachometerAlt />
            Summary
          </NavLinkStyled>
          <NavLinkStyled to="/admin/products" activeClassName="link-active">
            <FaStore />
            Products
          </NavLinkStyled>
          <NavLinkStyled to="/admin/orders" activeClassName="link-active">
            <FaClipboard />
            Orders
          </NavLinkStyled>
          <NavLinkStyled to="/admin/users" activeClassName="link-active">
            <FaUsers />
            Users
          </NavLinkStyled>
          <NavLinkStyled
            to="/admin/create-product"
            activeClassName="link-active"
          ></NavLinkStyled>
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

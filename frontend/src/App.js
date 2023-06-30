import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import Search from "./components/search/Search";
import Footer from "./components/Footer";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import ProductCategory from "./components/pages/ProductListByCategory";
import Category from "./components/pages/Category";
import HomePage from "./components/pages/HomePage";
import FAQ from "./components/pages/FAQ";
import ReturnFAQ from "./components/pages/ReturnFAQ";
import PrivacyFAQ from "./components/pages/PrivacyFAQ";

import Cart from "./components/cart/Cart";
import CheckoutSuccess from "./components/checkout/CheckoutSuccess";
import Dashboard from "./components/admin/Dashboard";
import Summary from "./components/admin/Summary";
import Products from "./components/admin/Products";
import CreateProduct from "./components/admin/CreateProduct";
import ProductsList from "./components/admin/list/ProductsList";
import Users from "./components/admin/Users";
import Orders from "./components/admin/Orders";
import Order from "./components/Details/Order";
import UserProfile from "./components/Details/UserProfile";
import Product from "./components/Details/Product";
import UserDashboard from "./components/user/Dashboard";
import UserOrders from "./components/user/Orders";
import UserProfileEdit from "./components/user/UserProfileEdit";

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route path="/cart" exact component={Cart} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
          <Route path="/FAQ" exact component={FAQ} />
          <Route path="/ReturnFAQ" exact component={ReturnFAQ} />
          <Route path="/PrivacyFAQ" exact component={PrivacyFAQ} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/" exact component={HomePage} />
          <Route path="/product/:ProductID" component={Product} />
          <Route path="/order/:OrderID" component={Order} />
          <Route path="/user/:UserID" component={UserProfile} />
          <Route path="/category" exact component={Category} />
          <Route path="/search/:searchItem" exact component={Search} />
          <Route path="/category/:CategoryName" component={ProductCategory} />
          <Route path="/checkout-success" component={CheckoutSuccess} />
          <Route path="/admin">
            <Dashboard>
              <Route path="/admin/summary" component={Summary} />
              <Route path="/admin/products" component={Products} />
              <Route
                path="/admin/products/create-product"
                component={CreateProduct}
              />
              <Route path="/admin/users" component={Users} />
              <Route path="/admin/orders" component={Orders} />
              <Route path="/admin/products/list" component={ProductsList} />
            </Dashboard>
          </Route>
          <Route path="/profile">
            <UserDashboard>
              <Route path="/profile/orders" component={UserOrders} />
              <Route path="/profile/user" component={UserProfileEdit} />
            </UserDashboard>
          </Route>
          <Route path="*" component={NotFound} />
        </Switch>
        <Footer />
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;

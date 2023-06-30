import { useEffect, useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
import { addCartItem, clearCartApi } from "../../features/cartApi";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import PayButton from "../checkout/PayButton";
import { setLoggedIn, setUsername, setUserID } from "../../features/authSlice";
import {
  addToCart,
  clearCart,
  decreaseCart,
  removeFromCart,
  getTotals,
} from "../../features/cartSlice";

const Cart = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userID = useSelector((state) => state.auth.userID);
  const cartTotalAmount = useSelector((state) => state.cart.cartTotalAmount);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("loggedIn");
    const storedUsername = localStorage.getItem("username");
    const storedUserID = localStorage.getItem("userid");
    if (storedLoggedIn && storedUsername && storedUserID) {
      dispatch(setLoggedIn(storedLoggedIn === "true"));
      dispatch(setUsername(storedUsername));
      dispatch(setUserID(storedUserID));
    }
  }, [dispatch]);

  const handleUpdateCart = useCallback(
    async (cartItems) => {
      try {
        await addCartItem(userID, cartItems);
      } catch (error) {
        console.error(error);
      }
    },
    [userID]
  );

  useEffect(() => {
    if (isLoggedIn && cartItems.length > 0) {
      handleUpdateCart(cartItems);
    }
  }, [isLoggedIn, cartItems, handleUpdateCart]);

  useEffect(() => {
    dispatch(getTotals());
  }, [cartItems, dispatch]);

  const handleRemoveFromCart = (cartItem) => {
    dispatch(removeFromCart(cartItem));
  };

  const handleDecreaseCart = (cartItem) => {
    dispatch(decreaseCart(cartItem));
  };

  const handleIncreaseCart = (cartItem) => {
    dispatch(addToCart(cartItem));
  };

  const handleClearCart = async () => {
    try {
      await clearCartApi(userID);
      dispatch(clearCart());
      toast.success("Cart cleared successfully", { position: "bottom-left" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear cart", { position: "bottom-left" });
    }
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      history.push("/checkout");
    } else {
      history.push("/login");
    }
  };

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is currently empty</p>
          <div className="start-shopping">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="titles">
            <h3 className="product-title">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="Quantity">Quantity</h3>
            <h3 className="Total">Total</h3>
          </div>
          <div className="cart-items">
            {cartItems?.map((cartItem) => (
              <div className="cart-item" key={cartItem.ProductID}>
                <div className="cart-product">
                  <img src={cartItem.Image} alt={cartItem.Name} />
                  <div>
                    <h3>{cartItem.Name}</h3>
                    <p>{cartItem.Description}</p>
                    <button onClick={() => handleRemoveFromCart(cartItem)}>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-product-price">{cartItem.Price}VND</div>
                <div className="cart-product-quantity">
                  <button onClick={() => handleDecreaseCart(cartItem)}>
                    -
                  </button>
                  <div className="count">{cartItem.cartQuantity}</div>
                  <button onClick={() => handleIncreaseCart(cartItem)}>
                    +
                  </button>
                </div>
                <div className="cart-product-total-price">
                  {cartItem.Price * cartItem.cartQuantity}VND
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <button className="clear-cart" onClick={() => handleClearCart()}>
              Clear Cart
            </button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <span className="amount"> {cartTotalAmount} VND</span>
              </div>
              <p>Tax and shipping calculated at checkout</p>
              {isLoggedIn ? (
                <PayButton cartItems={cartItems} userID={userID} />
              ) : (
                <button
                  style={{ backgroundColor: "yellow", color: "black" }}
                  onClick={handleCheckout}
                >
                  Login to Checkout
                </button>
              )}
              <div className="continue-shopping">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Cart;

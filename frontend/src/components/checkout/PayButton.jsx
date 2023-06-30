import axios from "axios";

const PayButton = ({ cartItems, userID }) => {

  const handleCheckout = () => {
    if (userID) {
      axios
        .post(`http://localhost:5000/create-checkout-session`, {
          cartItems,
          userID,
        })
        .then((res) => {
          if (res.data.url) {
            window.location.href = res.data.url;
          }
        })
        .catch((error) => console.log(error.message));
    } else {
      console.log("User ID is undefined");
    }
  };

  return (
    <>
      <button onClick={() => handleCheckout()}>Check Out</button>
    </>
  );
};

export default PayButton;

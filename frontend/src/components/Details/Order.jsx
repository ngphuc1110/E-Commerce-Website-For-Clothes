import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetailsByIDApi } from "../../features/orderApi";

const Order = () => {
  const { OrderID } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDetails = await getOrderDetailsByIDApi(parseInt(OrderID));
        setOrder(orderDetails);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderDetails();
  }, [OrderID]);

  if (!order) {
    return <div>Loading...</div>;
  }
  return (
    <StyledOrder>
      <OrdersContainer>
        <h2>Order Details</h2>
        <p>
          Delivery Status:{" "}
          {order.Delivery_Status === "pending" ? (
            <Pending>Pending</Pending>
          ) : order.Delivery_Status === "dispatched" ? (
            <Dispatched>Dispatched</Dispatched>
          ) : order.Delivery_Status === "delivered" ? (
            <Delivered>Delivered</Delivered>
          ) : (
            "error"
          )}
        </p>
        <h3>Ordered Products</h3>
        <Items>
          {order.Products?.map((product, index) => (
            <Item key={index}>
              <ul>
                <li>
                  <span>Product:</span>
                  <span>{product.Name}</span>
                  <span>
                    <strong>Quantity:</strong> {product.Quantity}
                  </span>
                </li>
              </ul>
            </Item>
          ))}
        </Items>
        <div>
          <h3>Total Price</h3>
          <p>{order.Total + "VND"}</p>
        </div>
        <div>
          <h3>Shipping Details</h3>
          <p>Customer: {JSON.parse(order.Shipping).name}</p>
          <p>City: {JSON.parse(order.Shipping).address.city}</p>
          <p>Email: {JSON.parse(order.Shipping).email}</p>
        </div>
      </OrdersContainer>
    </StyledOrder>
  );
};

export default Order;

const StyledOrder = styled.div`
  margin: 3rem;
  display: flex;
  justify-content: center;
  h3 {
    margin: 1.5rem 0 0.5rem 0;
  }
`;

const OrdersContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: auto;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 5px;
  padding: 2rem;
`;

const Items = styled.div`
  span {
    margin-right: 1.5rem;
    &:first-child {
      font-weight: bold;
    }
  }
`;

const Item = styled.div`
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Pending = styled.div`
  color: rgb(253, 181, 40);
  background: rgb(253, 181, 40, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const Dispatched = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgb(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const Delivered = styled.div`
  color: rgb(102, 108, 255);
  background-color: rgba(102, 108, 255, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

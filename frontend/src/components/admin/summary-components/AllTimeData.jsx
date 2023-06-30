import { styled } from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

const AllTimeData = () => {
  const [orders, setOrders] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/topstats");

        setOrders(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);
  return (
    <Main>
      {isloading ? (
        <p>Transactions loading...</p>
      ) : (
        <>
          <h3>All Time</h3>
          {orders?.map((order, index) => {
            const shipping = JSON.parse(order.Shipping);
            return (
              <div key={index}>
                <Info>
                  <Title>Users</Title>
                  <Data>{shipping.name}</Data>
                </Info>
                <Info>
                  <Title>Products Quantity</Title>
                  <Data>{order.TotalQuantity}</Data>
                </Info>
                <Info>
                  <Title>OrderID</Title>
                  <Data>{order.OrderID}</Data>
                </Info>
                <Info>
                  <Title>Earnings</Title>
                  <Data>{order.Total}</Data>
                </Info>
              </div>
            );
          })}
        </>
      )}
    </Main>
  );
};

export default AllTimeData;

const Main = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);
  margin-top: 1.5rem;
  border-radius: 5px;
  padding: 1rem;
  font-size: 14px;
`;

const Info = styled.div`
  display: flex;
  margin-top: 1rem;
  padding: 0.3rem;
  border-radius: 3px;
  background: rgba(38, 198, 249, 0.12);
  &:nth-child(even) {
    background: rgba(102, 108, 255, 0.12);
  }
`;

const Title = styled.div`
  flex: 1;
`;

const Data = styled.div`
  flex: 1;
  font-weight: 700;
`;

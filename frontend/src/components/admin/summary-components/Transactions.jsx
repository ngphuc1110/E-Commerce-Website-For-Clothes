import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/orders/transactions/recent"
        );

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
    <StyledTransactions>
      {isloading ? (
        <p>Transactions loading...</p>
      ) : (
        <>
          <h3>Latest Transactions</h3>
          {orders?.map((order, index) => {
            const shipping = JSON.parse(order.Shipping);

            return (
              <Transaction key={index}>
                <p>{shipping.name}</p>
                <p>{order.Total.toLocaleString()}</p>
                <p>{moment(order.Created_At).fromNow()}</p>
              </Transaction>
            );
          })}
        </>
      )}
    </StyledTransactions>
  );
};

export default Transactions;

const StyledTransactions = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);
  padding: 1rem;
  border-radius: 5px;
`;

const Transaction = styled.div`
  display: flex;
  font-size: 14px;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 3px;
  background: rgba(38, 198, 249, 0.12);
  p {
    flex: 1;
  }
  &:nth-child(even) {
    background: rgba(102, 108, 255, 0.12);
  }
`;

import { styled } from "styled-components";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { orderApi } from "../../../features/orderApi";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";

export default function OrdersList() {
  const history = useHistory();
  const storeduserID = localStorage.getItem("userid");

  const [orders, setOrders] = useState([]);
  console.log(storeduserID);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await orderApi();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const rows = orders
    .map((item) => {
      if (item.UserID === parseInt(storeduserID)) {
        return {
          id: item.OrderID,
          cName: JSON.parse(item.Shipping).name,
          amount: item.Total,
          dStatus: item.Delivery_Status,
          date: moment(item.Created_At).fromNow(),
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  const columns = [
    {
      field: "cName",
      headerName: "Name",
      width: 200,
    },
    { field: "amount", headerName: "Amount", width: 200 },
    {
      field: "dStatus",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row.dStatus === "pending" ? (
              <Pending>Pending</Pending>
            ) : params.row.dStatus === "dispatched" ? (
              <Dispatched>Dispatched</Dispatched>
            ) : params.row.dStatus === "delivered" ? (
              <Delivered>Delivered</Delivered>
            ) : (
              "error"
            )}
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 220,
      renderCell: (params) => {
        return (
          <Actions>
            <View onClick={() => history.push(`/order/${params.row.id}`)}>
              View
            </View>
          </Actions>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: "85%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </div>
  );
}

const View = styled.button`
  background-color: rgb(114, 225, 40);
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
  color: rgb(92, 186, 255);
  background-color: rgba(102, 108, 255, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  button {
    border: none;
    outline: none;
    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
`;

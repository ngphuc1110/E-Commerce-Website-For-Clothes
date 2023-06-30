import { styled } from "styled-components";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { orderApi } from "../../../features/orderApi";
import { updateDeliveryStatus } from "../../../features/orderSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";

export default function OrdersList() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [orders, setOrders] = useState([]);

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
  });

  const rows =
    orders.map((item) => ({
      id: item.OrderID,
      cName: JSON.parse(item.Shipping).name,
      amount: item.Total,
      dStatus: item.Delivery_Status,
      date: moment(item.Created_At).fromNow(),
    })) || [];

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "cName",
      headerName: "Name",
      width: 200,
    },
    { field: "amount", headerName: "Amount", width: 150 },
    {
      field: "dStatus",
      headerName: "Status",
      width: 100,
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
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 220,
      renderCell: (params) => {
        return (
          <Actions>
            <DispatchBtn onClick={() => handleOrderDispatch(params.row.id)}>
              Dispatch
            </DispatchBtn>
            <DeliveryBtn onClick={() => handleOrderDeliver(params.row.id)}>
              Deliver
            </DeliveryBtn>
            <View onClick={() => history.push(`/order/${params.row.id}`)}>
              View
            </View>
          </Actions>
        );
      },
    },
  ];

  const handleOrderDispatch = (orderId) => {
    dispatch(updateDeliveryStatus(orderId, "dispatched"));
  };

  const handleOrderDeliver = (orderId) => {
    dispatch(updateDeliveryStatus(orderId, "delivered"));
  };

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

const DispatchBtn = styled.button`
  background-color: rgb(38, 198, 249);
`;
const DeliveryBtn = styled.button`
  background-color: rgb(102, 108, 255);
`;

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

import { styled } from "styled-components";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllProductsQuery } from "../../../features/productsApi";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDeleteProductMutation } from "../../../features/productsApi";
import EditProduct from "../EditProduct";

export default function ProductsList() {
  const history = useHistory();
  const { data, refetch } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const handleDelete = async (productId) => {
    await deleteProduct(productId).unwrap();
    refetch();
  };
  const rows =
    data?.map((item) => ({
      id: item.ProductID,
      imageUrl: item.Image,
      pName: item.Name,
      pDesc: item.Description,
      price: item.Price,
    })) || [];

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "imageUrl",
      headerName: "Image",
      width: 80,
      renderCell: (params) => {
        return (
          <ImageContainer>
            <img src={params.row.imageUrl} alt="" />
          </ImageContainer>
        );
      },
    },
    { field: "pName", headerName: "Name", width: 200 },
    {
      field: "pDesc",
      headerName: "Description",
      width: 300,
    },
    {
      field: "price",
      headerName: "Price",
      width: 80,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 170,
      renderCell: (params) => {
        return (
          <Actions>
            <Delete onClick={() => handleDelete(params.row.id)}>Delete</Delete>
            <EditProduct prodID={params.row.id} />
            <View onClick={() => history.push(`/product/${params.row.id}`)}>
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

const ImageContainer = styled.div`
  img {
    height: 40px;
  }
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

const Delete = styled.button`
  background-color: rgb(255, 77, 73);
`;

const View = styled.button`
  background-color: rgb(114, 225, 40);
`;

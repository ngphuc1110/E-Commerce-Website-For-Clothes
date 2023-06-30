import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect } from "react";
import { PrimaryButton } from "./CommonStyled";
import axios from "axios";
import { useGetAllProductsQuery } from "../../features/productsApi";
import styled from "styled-components";

export default function EditProduct({ prodID }) {
  const [open, setOpen] = useState(false);
  const [currentProd, setCurrentProd] = useState({});
  const [previewImg, setPreviewImg] = useState("");
  const [ProductImg, setProductImg] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: products, refetch } = useGetAllProductsQuery();

  useEffect(() => {
    if (products) {
      const selectedProd = products.find((item) => item.ProductID === prodID);

      if (selectedProd) {
        setCurrentProd(selectedProd);
        setPreviewImg(selectedProd.Image);
        setProductImg(selectedProd.Image);
        setName(selectedProd.Name);
        setPrice(selectedProd.Price);
        setDesc(selectedProd.Description);
      }
    }
  }, [products, prodID]);

  const handleProductImageUpLoad = (e) => {
    const file = e.target.files[0];
    if (file) {
      transformFile(file);
    } else {
      setProductImg(currentProd.Image);
      setPreviewImg(currentProd.Image);
    }
  };

  const transformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImg(reader.result);
        setPreviewImg(reader.result);
      };
    } else {
      setProductImg("");
      setPreviewImg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name,
      price,
      description: desc,
      image: ProductImg,
    };

    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/products/${parseInt(prodID)}`,
        productData
      );

      if (response.data) {
        handleClose();
      }
      refetch();
    } catch (error) {
      console.error("Error editing the product:", error);
    }

    setIsLoading(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Edit onClick={handleClickOpen}>Edit</Edit>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <h3>Edit Product</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleProductImageUpLoad}
              />
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                type="number"
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <TextField
                label="Short Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? "Updating" : "Update"}
              </PrimaryButton>
            </StyledForm>
            <ImagePreview>
              {previewImg ? (
                <img src={previewImg} alt="product" />
              ) : (
                <p>Image Preview will appear here!</p>
              )}
            </ImagePreview>
          </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Exit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Edit = styled.button`
  border: none;
  outline: none;
  padding: 3px 5px;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  background-color: #4b70e2;
`;

const StyledEditProduct = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 0px solid rgb(182, 182, 182);
    margin-bottom: 1rem;

    &:focus {
      border: 0px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const ImagePreview = styled.div`
  margin: 2rem 0 2rem 2rem;
  padding: 2rem;
  border: 1px solid rgb(183, 183, 183);
  max-width: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgb(78, 78, 78);

  img {
    max-width: 100%;
  }
`;

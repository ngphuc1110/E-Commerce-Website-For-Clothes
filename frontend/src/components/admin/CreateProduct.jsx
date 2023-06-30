import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "./CommonStyled";
import { toast } from "react-toastify";
import {
  useCreateProductMutation,
  useGetAllProductsQuery,
} from "../../features/productsApi";
import { categoryApi } from "../../features/categoryApi";

const CreateProduct = () => {
  const { createStatus } = useSelector((state) => state.products);

  const [ProductImg, setProductImg] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  console.log(ProductImg);

  const handleProductImageUpLoad = (e) => {
    const file = e.target.files[0];

    TransformFile(file);
  };

  const [createProductMutation] = useCreateProductMutation();
  const { refetch } = useGetAllProductsQuery();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await createProductMutation({
      name,
      price,
      description: desc,
      image: ProductImg,
    });
    if (data) {
      console.log("Product created successfully");
      toast.success("Product created successfully", {
        position: "bottom-left",
      });
    } else {
      console.error("Error creating the product");
    }

    const ProductID = data.productId;

    const { response } = await categoryApi({
      ProductID: parseInt(ProductID),
      CategoryID: parseInt(CategoryID),
    });

    if (response) {
      console.log("Product and category created successfully");
    } else {
      console.error("Error creating the product");
    }

    e.target.reset();

    refetch();
  };

  const TransformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImg(reader.result);
      };
    } else {
      setProductImg("");
    }
  };
  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <h3>Create a Product</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleProductImageUpLoad}
          required
        />
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select
          placeholder="Category"
          onChange={(e) => setCategoryID(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled selected>
            Select a category
          </option>
          <option value={1}>Men</option>
          <option value={2}>Women</option>
          <option value={3}>New</option>
        </select>
        <input
          type="text"
          placeholder="Short Description"
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <PrimaryButton type="submit">
          {createStatus === "pending" ? "Submitting" : "Submit"}
        </PrimaryButton>
      </StyledForm>
      <ImagePreview>
        {ProductImg ? (
          <>
            <img src={ProductImg} alt="product" />
          </>
        ) : (
          <p>Image Preview will appear here!</p>
        )}
      </ImagePreview>
    </StyledCreateProduct>
  );
};

export default CreateProduct;

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
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledCreateProduct = styled.div`
  display: flex;
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

import { useParams } from "react-router-dom";
import { styled } from "styled-components";
import { useDispatch } from "react-redux";
import { useGetProductByIdQuery } from "../../features/productsApi";
import { addToCart } from "../../features/cartSlice";
import { useHistory } from "react-router";

const Product = () => {
  const { ProductID } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    data: product,
    error,
    isLoading,
  } = useGetProductByIdQuery(parseInt(ProductID));

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    history.push("/cart");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.log(error);
    return <p>An error occurred</p>;
  }

  if (!product) {
    return null;
  }

  return (
    <StyledProduct>
      <ProductContainer>
        <ImageContainer>
          <img src={product.Image} alt="product" />
        </ImageContainer>
        <ProductDetails>
          <h3>{product.Name}</h3>
          <p>
            <span>Description:</span> {product.Description}
          </p>
          <Price>{product.Price}VND</Price>
          <button
            className="product-add-to-cart"
            onClick={() => handleAddToCart(product)}
          >
            Add To Cart
          </button>
        </ProductDetails>
      </ProductContainer>
    </StyledProduct>
  );
};

export default Product;

const StyledProduct = styled.div`
  margin: 3rem;
  display: flex;
  justify-content: center;
`;

const ProductContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  height: auto;
  display: flex;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 5px;
  padding: 2rem;
`;

const ImageContainer = styled.div`
  flex: 1;
  img {
    width: 100%;
  }
`;

const ProductDetails = styled.div`
  flex: 2;
  margin-left: 2rem;
  h3 {
    font-size: 35px;
  }
  p span {
    font-weight: bold;
  }
`;

const Price = styled.div`
  margin: 1rem 0;
  font-weight: bold;
  font-size: 25px;
`;

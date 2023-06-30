import { useHistory } from "react-router-dom";
import { AdminHeaders, PrimaryButton } from "./CommonStyled";
import ProductsList from "./list/ProductsList";

const Products = ({ children }) => {
  const history = useHistory();

  return (
    <>
      <AdminHeaders>
        Products
        <PrimaryButton
          onClick={() => history.push("/admin/products/create-product")}
        >
          Create
        </PrimaryButton>
      </AdminHeaders>
      <div>{children}</div>
      <ProductsList />
    </>
  );
};

export default Products;

import React from "react";
import { useParams } from "react-router";
import { useGetSearchQuery } from "../../features/productsApi";

const Search = () => {
  const { searchItem } = useParams();

  const { data, error, isLoading } = useGetSearchQuery(searchItem);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.log(error);
    return <p>An error occurred</p>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="home-container">
      <h2>Search Result</h2>
      <div className="products">
        {data?.map((searchItem) => (
          <div key={searchItem.ProductID} className="product">
            <h3>{searchItem.Name}</h3>
            <a href={`/product/${searchItem.ProductID}`}>
              <img src={searchItem.Image} alt={searchItem.Name} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;

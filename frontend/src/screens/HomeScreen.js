// Thanks to a Babel improvement, import React is done automatically (at least, to use .createElement)
// import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProducts } from "../actions/productActions";

const HomeScreen = () => {
  // This hook substitutes the connect HO method with mapStateToProps
  const dispatch = useDispatch();

  // What useSelector takes in is an arrow function where we pass the state and then we select the part of the state that we want
  const productList = useSelector((state) => state.productList);
  // These are all possible properties that the productListReducer may return
  const { loading, error, products } = productList;
  useEffect(() => {
    // This fires off the action to get the products, send it through the reducer down into the state
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <>
      <h1>Latest Products</h1>
      {/* Checks if loading -> error -> products */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  // We need the location to access the query string. We are also passing history to redirect
  // Location.search will look something like ?qty=1, and we only want the number after the equal sign. That's why we are splitting and accessing the index 1. And what gives us is NOT gonna be in number data type, so we use Number(). Split returns an ordered list of substrings. Number() converts a number or an string to a number type.
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();

  // We want to get our cartItems from Redux and display them on the UI.
  const cart = useSelector((state) => state.cart);

  const { cartItems } = cart;

  useEffect(() => {
    // We only want to dispatch addToCart if there is a productId. If we just go to the regular cart page, we don't want to dispatch addToCart.
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const checkoutHandler = () => {
    // here we are redirecting the user -> if they are NOT logged in, they are gonna go to login, and if they are logged in, they'll go to shipping
    history.push("/login?redirect=shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {/* We may want to display something different if the array of cartItems is empty. BUT, we always want to prevent the cart itemps from being mapped if its value is undefined. Otherwise, it will break the app */}
        {typeof cartItems === undefined || cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    {/* This is the form control from ProductScreen, slightly modified */}
                    <Form.Control
                      as="select"
                      // here we have to substitute qty (which state doesn't exist here) for item.qty
                      // value={qty}
                      value={item.qty}
                      // We don't have setQty available, because qty is not available in our component state, so instead we want to dispatch the item again with the quantity newly selected. To make sure it is a number, we wrap it with Number()
                      // onChange={(e) => setQty(e.target.value)}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {/* this creates an array of values up to countInStock */}
                      {[...Array(item.countInStock).keys()]
                        .slice(0, 10)
                        // with slice we can limit the max items the user can order
                        .map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal (
                {cartItems.reduce((acc, curItem) => acc + curItem.qty, 0)})
                items
              </h2>
              $
              {cartItems
                .reduce((acc, curItem) => acc + curItem.price * curItem.qty, 0)
                // we add toFixed(2) to fix the value to two decimal
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;

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
import { addToCart } from "../actions/cartActions";

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  // We need the location to access the query string. We are also passing history to redirect
  // Location.search will look something like ?qty=1, and we only want the number after the equal sign. That's why we are splitting and accessing the index 1. And what gives us is NOT gonna be in number data type, so we use Number(). Split returns an ordered list of substrings. Number() converts a number or an string to a number type.
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();

  // We want to get our cartItems from Redux and display them on the UI.
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  console.log(cartItems);

  useEffect(() => {
    // We only want to dispatch addToCart if there is a productId. If we just go to the regular cart page, we don't want to dispatch addToCart.
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  return <div>Cart</div>;
};

export default CartScreen;

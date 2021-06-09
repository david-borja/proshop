import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  // console.log(userLogin);
  const { loading, error, userInfo } = userLogin;
  // console.log(location);
  // This is what location would print if the URL were: http://localhost:3000/login?=123 -> {pathname: "/login", search: "?=123", hash: "", state: undefined}
  const redirect = location.search ? location.search.split("=")[1] : "/";
  // So, in case any search string is provided, we save the right side of the equal. It allows us to redirect to something different than the homepage.

  useEffect(() => {
    // If there is a user logged in, we want to redirect if it hits the login page.
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    // We don't want the form submission to refresh the page.
    e.preventDefault();
    // DISPATCH LOGIN ACTION
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {/* error and loading are pieces of state coming from the Redux store */}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        {/* controlId attribute comes from react-bootstrap */}
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            // This is a controlled form input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            // This is a controlled form input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{" "}
          {/* If there is a redirect value, redirect will be whatever that redirect variable is. Else, it's just gonna go to /register */}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;

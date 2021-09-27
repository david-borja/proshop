// Tedious way of importing
// import { PRODUCT_LIST_REQUEST } from "../constants/productConstants";
// import { PRODUCT_LIST_SUCCESS } from "../constants/productConstants";
// import { PRODUCT_LIST_FAIL } from "../constants/productConstants";

import axios from "axios";

import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
} from "../constants/productConstants";

// What this ACTION CREATOR is gonna do what we did in our useEffect in the homescreen. Here we want to make an asynchronous request, so here is where Redux thunk comes in. What Redux thunk allows us to do is to add a function within a function. Here in this graph seems that it has to be done the CROWN CLOTHING way: https://redux.js.org/tutorials/essentials/part-5-async-logic
export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    // After that, this is where we wanna make our request -> However! In the shopActions of the CROWN CLOTHING APP we first made the async request and THEN dispatched the action.
    const { data } = await axios.get("/api/products");
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    // error.response gives the generic message, but if we have a custom error we also wanna check error.response.data.message
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listProductDetails = (productId) => async (dispatch) => {
  try {
    // When we dispatch a request, automatically it sets loading to true (see productReducers)
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    // const data = await JSON.parse(res); DON'T NEED THIS IF WE USE AXIOS!
    const { data } = await axios.get(`/api/products/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    // error.response gives the generic message, but if we have a custom error we also wanna check error.response.data.message
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });

    // It destructures two levels deep
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    console.log({ error });
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        // Basically, the error  we get is gonna be the same in all the actions
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });

    // It destructures two levels deep
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We are making a post request, but we are not sending any data
    const { data } = await axios.post(`/api/products`, {}, config);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log({ error });
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        // Basically, the error  we get is gonna be the same in all the actions
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    });

    // It destructures two levels deep
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We are making a post request, but we are not sending any data
    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    );

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log({ error });
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        // Basically, the error  we get is gonna be the same in all the actions
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

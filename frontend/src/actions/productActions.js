// Tedious way of importing
// import { PRODUCT_LIST_REQUEST } from "../constants/productConstants";
// import { PRODUCT_LIST_SUCCESS } from "../constants/productConstants";
// import { PRODUCT_LIST_FAIL } from "../constants/productConstants";

import axios from "axios";

import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
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

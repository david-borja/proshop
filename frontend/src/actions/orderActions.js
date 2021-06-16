import axios from "axios";
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
} from "../constants/orderConstants";

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
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

    console.log({ order });

    // As the second argument we pass the order object
    const { data } = await axios.post(`/api/orders`, order, config);

    console.log({ data });

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log({ error });
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        // Basically, the error  we get is gonna be the same in all the actions
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });

    // It destructures two levels deep
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        // It's a get request, so "Content-Type" is not needed
        // "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // As the second argument we pass the order object
    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log({ error });
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        // Basically, the error  we get is gonna be the same in all the actions
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

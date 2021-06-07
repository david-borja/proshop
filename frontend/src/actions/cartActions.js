// WHY AXIOS here? -> When we add an item to the cart, we want to make a request to api/products/:id to get the data for that particular product to add to our cart
import axios from "axios";

import {
  // ADD_TO_CART_REQUEST,
  // ADD_TO_CART_SUCCESS,
  // ADD_TO_CART_FAIL,
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
} from "../constants/cartConstants";

// Here is my first try
// export const addToCart = (productId, qty) => async (dispatch) => {
//   try {
//     // When we dispatch a request, automatically it sets loading to true
//     dispatch({ type: ADD_TO_CART_REQUEST });
//     // const data = await JSON.parse(res); DON'T NEED THIS IF WE USE AXIOS! -> forget this line, because here we are awaiting, when actually JSON.parse() is synchronous. Also, when we use fetch we want to use json(). -> AJAX works with callbacks, fetch with Promises.
// Use JSON.parse() to parse the response for AJAX. Use json() to parse the response for fetch.
//     // DO I NEED TO MAKE AN AXIOS REQUEST TO A ROUTE TO UPDATE CART?? DON'T I HAVE THAT INFO IN THE COMPONENT ALREADY?
//     // Another doubt: why do we write the question mark either before or after the query string?
//     const { data } = await axios.get(`/cart/${productId}?/?qty=${qty}`);
//     dispatch({ type: ADD_TO_CART_SUCCESS, payload: data });
//   } catch (error) {
//     // error.response gives the generic message, but if we have a custom error we also wanna check error.response.data.message
//     dispatch({
//       type: ADD_TO_CART_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

// productId and qty will be passed in from the screen using the URL
// ALSO: we are gonna save our entire cart to localStorage, so along with dispatch pass getState (by Redux), and that allows us to get our entire state tree
export const addToCart = (productId, qty) => async (dispatch, getState) => {
  // If at the end we are using async actions, why aren't we using REQUEST, SUCCESS, FAIL?
  // Also, we are first doing the axios request and then dispatching the action, as opposed to the productActions, where we first dispatch the REQUEST action.

  const { data } = await axios.get(`/api/products/${productId}`);

  // Our dbs data is available at this route, and we assign it to the action payload
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });
  // We save it to localStorage, but where do we get it? -> in our store
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

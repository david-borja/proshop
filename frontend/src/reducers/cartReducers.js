import {
  // ADD_TO_CART_REQUEST,
  // ADD_TO_CART_SUCCESS,
  // ADD_TO_CART_FAIL,
  CART_ADD_ITEM,
} from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    // case ADD_TO_CART_REQUEST:
    //   return { loading: true, ...state };
    // case ADD_TO_CART_SUCCESS:
    //   return { loading: false, cartItems: action.payload };
    // case ADD_TO_CART_FAIL:
    //   return { loading: false, error: action.payload };
    // default:
    //   return state;

    case CART_ADD_ITEM:
      // it is a little bit tricky, because if we add an item that is already in the cart, it behaves different to when the item is newly added
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          // This way below, I'd say we overwrite the item.qty, instead of increasing it
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
          // This is the way I'd have done it (it increases the qty)
          // cartItems: state.cartItems.map((x) =>
          //   x.product === existItem.product
          //     ? { ...x, qty: x.qty + item.qty }
          //     : x
          // ), -> It seems it makes sense to overwrite the items.qty. Because this function is gonna trigger every time we hit the cart route with a productId. So if the user refreshes the page after adding an item with quantity 2, it will be quantity 4 after the refresh.
          // With the above solution, we avoid this problem.
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }

    default:
      return state;
  }
};

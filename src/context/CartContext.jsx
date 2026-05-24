import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: {},        // { [itemId]: quantity }
  promoApplied: false,
  discount: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: (state.items[action.id] || 0) + 1,
        },
      };
    case 'REMOVE_ITEM': {
      const updated = { ...state.items };
      delete updated[action.id];
      return { ...state, items: updated };
    }
    case 'SET_QTY': {
      if (action.qty <= 0) {
        const updated = { ...state.items };
        delete updated[action.id];
        return { ...state, items: updated };
      }
      return { ...state, items: { ...state.items, [action.id]: action.qty } };
    }
    case 'APPLY_PROMO':
      return { ...state, promoApplied: true, discount: action.discount };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem    = useCallback((id) => dispatch({ type: 'ADD_ITEM', id }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', id }), []);
  const setQty     = useCallback((id, qty) => dispatch({ type: 'SET_QTY', id, qty }), []);
  const applyPromo = useCallback((code) => {
    const valid = { FLAVOR10: 10, RUSH20: 20 };
    const pct = valid[code.toUpperCase()];
    if (pct) { dispatch({ type: 'APPLY_PROMO', discount: pct }); return true; }
    return false;
  }, []);
  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const totalItems = Object.values(state.items).reduce((a, b) => a + b, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, setQty, applyPromo, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

export default function useCart() {
    return useContext(CartContext);
}

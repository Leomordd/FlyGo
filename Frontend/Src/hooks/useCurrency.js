import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext.jsx';

export default function useCurrency() {
    return useContext(CurrencyContext);
}

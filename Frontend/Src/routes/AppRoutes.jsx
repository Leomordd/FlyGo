import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Offers from '../pages/Offers.jsx';
import CustomPlan from '../pages/CustomPlan.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Packages from '../pages/Packages.jsx';
import Cart from '../pages/Cart.jsx';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planes" element={<Packages />} />
            <Route path="/ofertas" element={<Offers />} />
            <Route path="/plan-personalizado" element={<CustomPlan />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Offers from '../pages/Offers.jsx';
import CustomPlan from '../pages/CustomPlan.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Packages from '../pages/Packages.jsx';
import Cart from '../pages/Cart.jsx';
import Documentation from '../pages/Documentation.jsx';
import PackageDetail from '../pages/PackageDetail.jsx';
import Search from '../pages/Search.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planes" element={<Packages />} />
            <Route path="/planes/:packageId" element={<PackageDetail />} />
            <Route path="/ofertas" element={<Offers />} />
            <Route path="/buscar" element={<Search />} />
            <Route path="/documentacion" element={<Documentation />} />
            <Route path="/plan-personalizado" element={<CustomPlan />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

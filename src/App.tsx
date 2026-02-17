import {BrowserRouter, Routes, Route, Outlet} from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
//import kvitteringer from "./pages/kvitteringer";
import Wallet from "./pages/Wallet";
import RewardList from "./pages/RewardList";
import RewardDetail from "./pages/RewardDetails";
import MyRewards from "./pages/MyRewards";
import ProductDetails from "./pages/ProductDetails";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { ToastProvider } from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";

import Navigation from './components/Navigation';
import ScanProdukt from './scanner';



import PointsOverview from './pages/pointsOverview';

function AppLayout() {
    return (
        <div className="min-h-screen pb-24">
            <main>
                <Outlet />
            </main>
            <Navigation />
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route element={<AppLayout />}>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    {/*<Route path="/kvitteringer" element={<kvitteringer/>}/>*/} 
                    <Route path="/points-overview" element={<PointsOverview />} />
                    <Route path="/reward" element={<RewardList/>}/> {/* POC-025*/} 
                    <Route path="/my-rewards" element={<MyRewards />} />
                    <Route path="/reward/:id" element={<RewardDetail/>}> {/* POC-026*/}
                    </Route>
                    <Route path="/scan" element={<ScanProdukt/>}/>
                    <Route path="/product/:barcode" element={<ProductDetails/>}/>
                    <Route path="/basket" element={<Basket/>}/>
                    <Route path="/checkout" element={<Checkout/>}/>
                    <Route path="/wallet" element={<Wallet/>}/>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AppRoutes />
            </ToastProvider>
        </BrowserRouter>
    );
}





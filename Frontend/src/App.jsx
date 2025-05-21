import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import CartPage from "./pages/Cart";
import SingleOrderPage from "./pages/SingleOrder";
import CartOrderPage from "./pages/CartOrder";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProductsPage from "./pages/Admin/AdminProducts";
import AdminProductTypesPage from "./pages/Admin/AdminProductTypes";
import AdminSubCategoriesPage from "./pages/Admin/AdminSubCategories";
import AdminOrdersPage from "./pages/Admin/AdminOrders";
import AboutUs from "./pages/AboutUs";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Router>
      <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: "#3E2723", // Rich Dark Chocolate Background
              color: "#FCE4D8",      // Soft Creamy Text
              borderRadius: "12px",
              border: "2px solid #8D6E63", // Chocolate Brown Border
              padding: "14px 18px",
              fontSize: "16px",
              fontFamily: "'Playfair Display', serif",
              boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.25)",
            },
            success: {
              style: {
                background: "#4E342E",  // Deep Chocolate Brown
                color: "#FFDAB9",       // Peachy Cream Text
                borderLeft: "6px solid #D7A86E", // Golden Toasted Highlight
              },
              iconTheme: {
                primary: "#D7A86E", // Golden Success Icon
                secondary: "#FFF5E1",
              },
            },
            error: {
              style: {
                background: "#8B4513",  // Burnt Chocolate for Errors
                color: "#FFEBD2",       // Warm Vanilla Text
                borderLeft: "6px solid #E57373", // Soft Reddish Highlight
              },
              iconTheme: {
                primary: "#E57373", // Error Icon in Subtle Red
                secondary: "#FFF5E1",
              },
            },
          }}
      />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/products" element={<Product/>}/>
        <Route path="/productDetail" element={<ProductDetail/>}/>
        <Route path="/about" element={<AboutUs/>}/>
        
        <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/order" element={<SingleOrderPage/>}/>
          <Route path="/cartOrder" element={<CartOrderPage/>}/>
          <Route path="/orderSuccess" element={<OrderSuccess/>}/>
          <Route path="/myOrders" element={<MyOrders/>}/>

            <Route element={<AdminRoute/>}>
              <Route path="/admin" element={<AdminDashboard/>}/>
              <Route path="/adminProducts" element={<AdminProductsPage/>}/>
              <Route path="/productTypes" element={<AdminProductTypesPage/>}/>
              <Route path="/subcategories" element={<AdminSubCategoriesPage/>}/>
              <Route path="/adminOrders" element={<AdminOrdersPage/>}/>
            </Route>
            
        </Route>
        
      </Routes>
    </Router>
  );
};

export default App;

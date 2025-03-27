import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmailVerification from "./pages/EmailVerification";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/emailVerification" element={<EmailVerification/>}/>
      </Routes>
    </Router>
  );
};

export default App;

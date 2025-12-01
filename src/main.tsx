import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/main.css";
import Amortization from "./pages/Amortization";
import Home from "./pages/Home";
import Fee from "./pages/AdvanceRate";
import PresentValue from "./pages/PresentValue";
import FutureValue from "./pages/FutureValue";
import RateConversion from "./pages/RateConversion";
import Annuities from "./pages/Annuities";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/present-value" element={<PresentValue />} />
        <Route path="/future-value" element={<FutureValue />} />
        <Route path="/advance-rate" element={<Fee />} />
        <Route path="/conversion-rate" element={<RateConversion />} />
        <Route path="/annuities" element={<Annuities />} />
        <Route path="/amortization" element={<Amortization />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

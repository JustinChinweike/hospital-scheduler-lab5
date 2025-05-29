import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { OfflineProvider } from "./context/OfflineContext";
import { ScheduleProvider } from "./context/ScheduleContext";
import AddSchedulePage from "./pages/AddSchedulePage";
import EditSchedulePage from "./pages/EditSchedulePage";
import ListSchedulePage from "./pages/ListSchedulePage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const App = () => (
  <OfflineProvider>
    <ScheduleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/add-schedule" element={<AddSchedulePage />} />
          <Route path="/edit-schedule/:id" element={<EditSchedulePage />} />
          <Route path="/list-schedule" element={<ListSchedulePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ScheduleProvider>
  </OfflineProvider>
);

export default App;

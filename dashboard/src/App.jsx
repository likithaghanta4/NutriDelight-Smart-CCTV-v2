import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import VisitorAnalytics from "./components/VisitorAnalytics";
import VehicleAnalytics from "./components/VehicleAnalytics";
import Settings from "./components/Settings";
import OwnerLogin from "./components/OwnerLogin";
import OwnerProtectedRoute from "./components/OwnerProtectedRoute";
import OwnerLayout from "./components/OwnerLayout";
import OwnerDashboard from "./components/OwnerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="visitor-analytics" element={<VisitorAnalytics />} />
          <Route path="vehicle-analytics" element={<VehicleAnalytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="owner/login" element={<OwnerLogin />} />

        <Route element={<OwnerProtectedRoute />}>
          <Route path="owner" element={<OwnerLayout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="visitor-analytics" element={<VisitorAnalytics />} />
            <Route path="vehicle-analytics" element={<VehicleAnalytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Dashboard } from "@/pages/dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { Layout } from "@/components/layout";
import { Login } from "@/pages/login";
import { Register } from "@/pages/register";
import { PatientList } from "@/pages/patients";
import { BedManagement } from "./pages/Bed";
import DoctorDashboard from "./pages/Verify";
import Handoff from "./pages/handoff";
import { AppointmentList } from "./pages/appointments";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        {" "}
        {/* ✅ Now AuthProvider is inside Router */}
        <Router>
          {" "}
          {/* ✅ Move Router to the outermost level */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/beds"
              element={
                <Layout>
                  <BedManagement />
                </Layout>
              }
            />
            <Route
              path="/verify"
              element={
                <Layout>
                  <DoctorDashboard />
                </Layout>
              }
            />
            <Route
              path="/patients"
              element={
                <Layout>
                  <PatientList />
                </Layout>
              }
            />
            <Route
              path="/appointments"
              element={
                <Layout>
                  <AppointmentList   />
                </Layout>
              }
            />
            <Route
              path="/handoff"
              element={
                <Layout>
                  <Handoff />
                </Layout>
              }
            />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

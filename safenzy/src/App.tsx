import { ProtectedRoute } from "./Components/ProtectedRoute";
import { GetPeerDetails } from "./Pages/GetPeerDetails";
import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/get-peer-details"
          element={
            <ProtectedRoute>
              <GetPeerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <GetPeerDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

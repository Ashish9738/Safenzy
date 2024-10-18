import { ProtectedRoute } from "./Components/ProtectedRoute";
import { GetPeerDetails } from "./Pages/GetPeerDetails";
import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home";
import { Map } from "./Pages/Map";

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
          path="/workspace/:userId"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import { LeafletMouseEvent, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import Openrouteservice from "openrouteservice-js";

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

const ors = new Openrouteservice.Directions({ api_key: ORS_API_KEY });

interface MapEventsProps {
  onMapClick: (e: LeafletMouseEvent) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

const Map: React.FC = () => {
  const [start, setStart] = useState<LatLngTuple | null>(null);
  const [end, setEnd] = useState<LatLngTuple | null>(null);
  const [route, setRoute] = useState<LatLngTuple[] | null>(null);

  const handleMapClick = (e: LeafletMouseEvent) => {
    if (!start) {
      setStart([e.latlng.lat, e.latlng.lng]);
    } else if (!end) {
      setEnd([e.latlng.lat, e.latlng.lng]);
    }
  };

  useEffect(() => {
    if (start && end) {
      ors
        .calculate({
          coordinates: [
            start.slice().reverse() as [number, number],
            end.slice().reverse() as [number, number],
          ],
          profile: "driving-car",
          format: "geojson",
        })
        .then((response: any) => {
          const coords = response.features[0].geometry.coordinates;
          setRoute(
            coords.map(
              (coord: [number, number]) => [coord[1], coord[0]] as LatLngTuple
            )
          );
        })
        .catch((error: Error) => {
          console.error("Error calculating route:", error);
        });
    }
  }, [start, end]);

  const startRide = () => {
    if (route) {
      console.log("Starting ride...");
      // Implement ride start logic here
    } else {
      console.log("Please set start and end points first.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header
        style={{
          padding: "10px 20px",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Ride Planner</h1>
        <button
          onClick={startRide}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Ride
        </button>
      </header>
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents onMapClick={handleMapClick} />
          {start && <Marker position={start} />}
          {end && <Marker position={end} />}
          {route && <Polyline positions={route} color="blue" />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;

import React, { useState, useEffect, useRef, FC } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LeafletMouseEvent, LatLngTuple, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Openrouteservice from "openrouteservice-js";
import { Button } from "@/Components/ui/button";
import { Link } from "react-router-dom";

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;
const ors = new Openrouteservice.Directions({ api_key: ORS_API_KEY });

const BENGALURU_CENTER: LatLngTuple = [12.9716, 77.5946];
const BENGALURU_BBOX = "77.4399,12.8345,77.7474,13.1036";

interface MapEventsProps {
  onMapClick: (e: LeafletMouseEvent) => void;
}

const MapEvents: FC<MapEventsProps> = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

const ChangeMapView: FC<{ center: LatLngTuple | null }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const Map: FC = () => {
  const [start, setStart] = useState<LatLngTuple | null>(null);
  const [end, setEnd] = useState<LatLngTuple | null>(null);
  const [route, setRoute] = useState<LatLngTuple[] | null>(null);
  const [isRiding, setIsRiding] = useState(false);
  const [userPosition, setUserPosition] = useState<LatLngTuple | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

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

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);

        recorder.start();
        setMediaRecorder(recorder);

        if ("geolocation" in navigator) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setUserPosition([latitude, longitude]);
            },
            (error) => {
              console.error("Error getting user location:", error);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Microphone permission is required to start the ride.");
      }
    }
  };

  const startRide = async () => {
    if (route) {
      try {
        const permission = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        if (permission.state === "granted") {
          startRecording();
          setIsRiding(true);
        } else if (permission.state === "prompt") {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          startRecording();
          setIsRiding(true);
        } else {
          console.log("Microphone permission denied. Cannot start ride.");
          alert("Microphone permission is required to start the ride.");
        }
      } catch (error) {
        console.error("Error checking microphone permission:", error);
        alert("An error occurred while checking microphone permission.");
      }
    } else {
      console.log("Please set start and end points first.");
    }
  };

  const stopRide = () => {
    setIsRiding(false);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (mediaRecorder) {
      mediaRecorder.stop();

      mediaRecorder.onstop = () => {
        mediaRecorder.stream?.getTracks()?.forEach((track) => track.stop());
        setMediaRecorder(null);
      };
    }
  };

  const userIcon = new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const handleSelectLocation = (result: any) => {
    const [lng, lat] = [parseFloat(result.lon), parseFloat(result.lat)];
    if (!start) {
      setStart([lat, lng]);
    } else if (!end) {
      setEnd([lat, lng]);
    }
    setSearchResults([]);
  };

  return (
    <div className="px-6 md:px-[200px] flex flex-col h-screen">
      <header className="p-4 flex justify-between items-center flex-wrap">
        <Link to="/">
          <h1 className="text-2xl font-bold cursor-pointer"> Safenzy</h1>
        </Link>
        <div className="flex items-center">
          <Button
            onClick={isRiding ? stopRide : startRide}
            className={`px-4 py-2 text-lg font-semibold text-white rounded-lg`}
          >
            {isRiding ? "Stop Ride" : "Start Ride"}
          </Button>
        </div>
      </header>

      {searchResults.length > 0 && (
        <div className="absolute top-16 right-5 bg-white z-50 p-4 rounded-lg shadow-lg">
          {searchResults.map((result, index) => (
            <div
              key={index}
              onClick={() => handleSelectLocation(result)}
              className="cursor-pointer py-2"
            >
              {result.display_name}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 relative">
        <MapContainer
          center={BENGALURU_CENTER}
          zoom={12}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents onMapClick={handleMapClick} />
          {start && <Marker position={start} />}
          {end && <Marker position={end} />}
          {route && <Polyline positions={route} color="blue" />}
          {userPosition && <Marker position={userPosition} icon={userIcon} />}
          <ChangeMapView center={userPosition} />
        </MapContainer>
      </div>
    </div>
  );
};

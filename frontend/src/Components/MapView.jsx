// MapView.jsx
import { Copy } from "lucide-react";
import React, {
  useEffect,
  useState,
} from "react";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import MarkerClusterGroup from "react-leaflet-cluster";

import toast from "react-hot-toast";

import "leaflet/dist/leaflet.css";

import locationPin
from "../assets/location-pin.png";

import markerPin
from "../assets/pin.png";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { useMapStore }
from "../store/mapStore.js";

// REMOVE DEFAULT ICON
delete L.Icon.Default.prototype._getIconUrl;


// ─────────────────────────────
// USER LOCATION ICON
// ─────────────────────────────

const userIcon = L.icon({

  iconUrl: locationPin,

  iconSize: [42, 42],

  iconAnchor: [21, 42],

  popupAnchor: [0, -40],
});


// ─────────────────────────────
// PHARMACY MARKER ICON
// ─────────────────────────────

const pharmacyIcon = L.icon({

  iconUrl: markerPin,

  iconSize: [38, 38],

  iconAnchor: [19, 38],

  popupAnchor: [0, -35],
});


    // ─────────────────────────────
    // MAP CENTER CONTROLLER
    // ─────────────────────────────

    function ChangeMapView({
      center,
      markers,
    }) {

      const map = useMap();

      useEffect(() => {

        // IF MARKERS EXIST
        if (markers.length > 0) {

          const validMarkers =
            markers.filter(
              (marker) =>
                marker?.location?.coordinates
            );

          if (validMarkers.length === 0) return;

          const bounds = L.latLngBounds(

            validMarkers.map((marker) => [

              marker.location.coordinates[1], // lat
              marker.location.coordinates[0], // lng

            ])
          );

          map.fitBounds(bounds, {

            padding: [60, 60],

            maxZoom: 15,
          });
        }

        // OTHERWISE USER LOCATION
        else if (center) {

          map.setView(center, 14);
        }

      }, [center, markers, map]);

      return null;
    }


// ─────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────

function MapView({
  setSelectedReportId,
}) {
  const [toastShown, setToastShown] =
    useState(false);
  const copyAddress = async (address) => {

  try {

    await navigator.clipboard.writeText(address);

    toast.success("Address copied");

  } catch (err) {

    toast.error("Failed to copy");
  }
};



  const {
    getLocation,
    userLocation,
    markers,
    loading,
    selectedMedicine,
  } = useMapStore();


  // ─────────────────────────────
  // INITIAL LOCATION LOAD
  // ─────────────────────────────

  useEffect(() => {

    const loadMap = async () => {

      await getLocation();
    };

    loadMap();

  }, []);


  // ─────────────────────────────
  // EMPTY STATE TOAST
  // ─────────────────────────────

  useEffect(() => {

    if (
      !loading &&
      markers.length === 0 &&
      !toastShown
    ) {

      toast("No nearby reports found");

      setToastShown(true);
    }

    // RESET TOAST STATE
    if (markers.length > 0) {

      setToastShown(false);
    }

  }, [
    markers,
    loading,
    toastShown,
  ]);


  return (

    <div className="h-full w-full relative">

      <MapContainer
        center={
          userLocation || [
            17.385,
            78.4867,
          ]
        }
        zoom={13}
        className="h-full w-full z-0"
      >

        {/* MOVE MAP */}
        <ChangeMapView
          center={userLocation}
          markers={markers}
        />


        {/* MAP TILE */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* USER LOCATION */}
        {userLocation && (

          <Marker
            position={userLocation}
            icon={userIcon}
          >

            <Popup>
              <div className="font-semibold">
                📍 You are here
              </div>
            </Popup>

          </Marker>
        )}


      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={(cluster) => {
            return L.divIcon({

              html: `
                <div
                  style="
                    background:#2563eb;
                    color:white;
                    width:45px;
                    height:45px;
                    border-radius:50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-weight:bold;
                    font-size:16px;
                    border:4px solid white;
                    box-shadow:0 4px 15px rgba(0,0,0,0.3);
                  "
                >
                  ${cluster.getChildCount()}
                </div>
              `,

              className: "",

              iconSize: [45, 45],
            });
          }}
        >
        {/* PHARMACY MARKERS */}
        {markers.map((marker) => {

          // SAFETY CHECK
          if (
            !marker?.location?.coordinates
          ) {
            return null;
          }

          const lat =
            marker.location
              .coordinates[1];

          const lng =
            marker.location
              .coordinates[0];
            
          // DISTANCE IN METERS
          const distanceInMeters = userLocation?L.latLng(userLocation).distanceTo(L.latLng(lat, lng)): 0;

          // KM
          const distanceInKm = (distanceInMeters / 1000).toFixed(1);
          
          const walkingMinutes = Math.ceil(distanceInKm * 12);
          const drivingMinutes = Math.ceil(distanceInKm * 3);

          return (

            <Marker
              key={marker.reportId}
              position={[lat, lng]}
              icon={pharmacyIcon}
            >

<Popup className="custom-popup" closeButton={false}>
  <div className="w-75 font-sans">

    {/* TOP STRIP */}
    <div className="px-4 pt-4 pb-3 border-b border-gray-100">
      
      <h2
        className="
        text-[15px]
        font-bold
        text-gray-900
        leading-snug
        tracking-tight
        "
      >
        {marker.pharmacyName}
      </h2>

      <div className="mt-2 flex items-center gap-1.5">

        <span
          className={`
          inline-flex items-center gap-1
          px-2 py-0.5 rounded-md
          text-[10px] font-semibold
          uppercase tracking-wide
          ${
            marker.isVerified
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
          }
        `}
        >
          {marker.isVerified && (
            <svg
              className="w-2.5 h-2.5"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path
                d="M10 3L5 8.5 2 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          )}

          {marker.isVerified
            ? "Verified"
            : "Unverified"}
        </span>

        <span
          className="
          inline-flex items-center
          px-2 py-0.5 rounded-md
          text-[10px] font-semibold
          uppercase tracking-wide
          bg-sky-50 text-sky-700
          ring-1 ring-sky-200
        "
        >
          {marker.stockLevel} Stock
        </span>
      </div>
    </div>


    {/* STATS */}
    <div
      className="
      px-4 py-3
      grid grid-cols-3
      divide-x divide-gray-100
    "
    >

      <div className="pr-3 flex flex-col gap-0.5">
        
        <p
          className="
          text-[10px]
          uppercase tracking-widest
          text-gray-400 font-semibold
        "
        >
          Distance
        </p>

        <p
          className="
          text-[17px]
          font-black text-gray-900
          leading-none
        "
        >
          {distanceInKm}

          <span
            className="
            text-xs font-semibold
            text-gray-400 ml-0.5
          "
          >
            km
          </span>
        </p>
      </div>

      <div className="px-3 flex flex-col gap-0.5">

        <p
          className="
          text-[10px]
          uppercase tracking-widest
          text-gray-400 font-semibold
        "
        >
          Est. Time
        </p>

        <p
          className="
          text-[17px]
          font-black text-gray-900
          leading-none
        "
        >
          ~{drivingMinutes}

          <span
            className="
            text-xs font-semibold
            text-gray-400 ml-0.5
          "
          >
            min
          </span>
        </p>
      </div>

      <div className="pl-3 flex flex-col gap-0.5">

        <p
          className="
          text-[10px]
          uppercase tracking-widest
          text-gray-400 font-semibold
        "
        >
          Trust
        </p>

        <p
          className="
          text-[17px]
          font-black text-blue-600
          leading-none
        "
        >
          {Math.min(
            100,
            (marker.verifiedCount * 10) -
            (marker.deniedCount * 5) +
            50
          )}

          <span
            className="
            text-xs font-semibold ml-0.5
          "
          >
            %
          </span>
        </p>
      </div>
    </div>


    {/* TRUST BAR */}
    <div className="px-4 pb-3">
      {(() => {

        const score = Math.min(
          100,
          (marker.verifiedCount * 10) -
          (marker.deniedCount * 5) +
          50
        );

        return (
          <div
            className="
            w-full h-1.5
            rounded-full bg-gray-100
            overflow-hidden
          "
          >
            <div
              className="
              h-full rounded-full
              bg-linear-to-r
              from-blue-400 to-blue-600
              transition-all
            "
              style={{
                width: `${score}%`,
              }}
            />
          </div>
        );
      })()}
    </div>


    {/* ACTIONS */}
    <div
      className="
      px-4 pb-4
      grid grid-cols-2 gap-2
    "
    >

      {/* NAVIGATE */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
        h-10 rounded-lg
        bg-blue-600 hover:bg-blue-700
        text-white!
        text-[12px] font-semibold
        tracking-wide
        flex items-center justify-center
        gap-1.5
        transition-colors duration-150
        shadow-sm
      "
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M8 2a4 4 0 0 1 4 4c0 3-4 8-4 8S4 9 4 6a4 4 0 0 1 4-4z" />

          <circle
            cx="8"
            cy="6"
            r="1.2"
            fill="currentColor"
            stroke="none"
          />
        </svg>

        Navigate
      </a>


      {/* DETAILS */}
      <button
        onClick={() =>
            setSelectedReportId(
              marker.reportId
            )
          }
        className="
        h-10 rounded-lg
        border border-gray-200
        bg-white hover:bg-gray-50
        text-gray-700
        text-[12px] font-semibold
        tracking-wide
        flex items-center justify-center
        gap-1.5
        transition-colors duration-150
      "
      >
        <svg
          className="
          w-3.5 h-3.5 text-gray-400
          "
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M8 3h5v10H3V3h5zm0 0V1" />

          <path d="M5.5 8h5M5.5 10.5h3" />
        </svg>

        Details
      </button>
    </div>
  </div>
</Popup>

            </Marker>
          );
        })}

        </MarkerClusterGroup>
      </MapContainer>


      {/* LOADING */}
      {loading && (

        <div
          className="
          absolute bottom-5 left-5
          z-1000
          bg-white shadow-2xl
          rounded-2xl px-5 py-3
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
              w-5 h-5 rounded-full
              border-2 border-blue-600
              border-t-transparent
              animate-spin
              "
            />

            <span
              className="
              font-medium text-gray-700
              "
            >
              {selectedMedicine
                ? `Searching ${selectedMedicine.name}...`
                : "Fetching nearby reports..."}
            </span>

          </div>

        </div>
      )}

    </div>
  );
}

export default MapView;
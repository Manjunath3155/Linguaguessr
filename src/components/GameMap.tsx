"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { useTranslation } from "@/lib/i18n";

interface GameMapProps {
  onPinPlaced: (lat: number, lng: number) => void;
  guessPin: { lat: number; lng: number } | null;
  correctPin: { lat: number; lng: number } | null;
  showResult: boolean;
  disabled: boolean;
}

export default function GameMap({
  onPinPlaced,
  guessPin,
  correctPin,
  showResult,
  disabled,
}: GameMapProps) {
  const { t } = useTranslation();
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Polyline: typeof import("react-leaflet").Polyline;
    useMapEvents: typeof import("react-leaflet").useMapEvents;
  } | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([rl, leaflet]) => {
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        Polyline: rl.Polyline,
        useMapEvents: rl.useMapEvents,
      });
      setL(leaflet.default || leaflet);
    });
  }, []);

  // When result is revealed, fit bounds to show both pins
  useEffect(() => {
    if (showResult && guessPin && correctPin && mapRef.current && L) {
      const bounds = L.latLngBounds(
        [guessPin.lat, guessPin.lng],
        [correctPin.lat, correctPin.lng]
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [showResult, guessPin, correctPin, L]);

  if (!MapComponents || !L) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-2 text-muted">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
          </svg>
          {t("errors.loadingMap")}
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Polyline, useMapEvents } = MapComponents;

  const guessIcon = L.divIcon({
    html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#00d4ff,#7c3aed);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  const correctIcon = L.divIcon({
    html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  function ClickHandler() {
    useMapEvents({
      click(e) {
        if (!disabled) {
          onPinPlaced(e.latlng.lat, e.latlng.lng);
        }
      },
    });
    return null;
  }

  const center: LatLngExpression = [20, 0];

  return (
    <MapContainer
      center={center}
      zoom={2}
      minZoom={2}
      maxZoom={10}
      doubleClickZoom={false}
      worldCopyJump={true}
      className={`h-full w-full rounded-xl ${disabled ? "map-disabled" : "map-active"}`}
      ref={(map) => {
        if (map) mapRef.current = map;
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <ClickHandler />
      {guessPin && (
        <Marker position={[guessPin.lat, guessPin.lng]} icon={guessIcon} />
      )}
      {showResult && correctPin && (
        <Marker position={[correctPin.lat, correctPin.lng]} icon={correctIcon} />
      )}
      {showResult && guessPin && correctPin && (
        <Polyline
          positions={[
            [guessPin.lat, guessPin.lng],
            [correctPin.lat, correctPin.lng],
          ]}
          pathOptions={{
            color: "#ff6b6b",
            weight: 3,
            dashArray: "10 6",
            opacity: 0.8,
          }}
        />
      )}
    </MapContainer>
  );
}

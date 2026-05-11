"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Place {
  city: string;
  country: string;
  year: number;
  note: string;
  lng: number;
  lat: number;
  home?: boolean;
}

interface TravelMapProps {
  places: Place[];
  active: number | null;
  onMarkerClick: (i: number) => void;
}

export default function TravelMap({ places, active, onMarkerClick }: TravelMapProps) {
  return (
    <ComposableMap
      projectionConfig={{ scale: 147, center: [40, 10] }}
      style={{ width: "100%", height: "100%" }}
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#1a1a1a", stroke: "#2a2a2a", strokeWidth: 0.5, outline: "none" },
                  hover: { fill: "#222", stroke: "#2a2a2a", strokeWidth: 0.5, outline: "none" },
                  pressed: { fill: "#222", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {places.map((p, i) => (
          <Marker
            key={p.city}
            coordinates={[p.lng, p.lat]}
            onClick={() => onMarkerClick(i)}
          >
            <circle
              r={active === i ? 6 : 4}
              fill={p.home ? "#4ade80" : "#fff"}
              fillOpacity={0.9}
              stroke={p.home ? "#4ade80" : "#fff"}
              strokeOpacity={0.3}
              strokeWidth={active === i ? 6 : 3}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
            />
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
}

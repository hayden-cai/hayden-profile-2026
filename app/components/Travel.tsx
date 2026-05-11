"use client";

import { useState, useRef, useEffect } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Sorted by year so the line follows the journey chronologically
const places = [
  { city: "Kunming", country: "China", year: 2015, note: "Hometown 故乡", lng: 102.7123, lat: 25.0389, home: false,
    photos: [
      { url: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80", label: "Yunnan scenery" },
      { url: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&q=80", label: "Stone Forest" },
    ]},
  { city: "London", country: "UK", year: 2019, note: "Always raining", lng: -0.1276, lat: 51.5074,
    photos: [
      { url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", label: "Tower Bridge" },
      { url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80", label: "Big Ben" },
    ]},
  { city: "Paris", country: "France", year: 2019, note: "Eiffel Tower ✨", lng: 2.3522, lat: 48.8566,
    photos: [
      { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", label: "Eiffel Tower" },
      { url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80", label: "Seine River" },
    ]},
  { city: "Barcelona", country: "Spain", year: 2019, note: "Gaudí & tapas", lng: 2.1734, lat: 41.3851,
    photos: [
      { url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80", label: "Sagrada Familia" },
      { url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80", label: "Park Güell" },
    ]},
  { city: "Melbourne", country: "Australia", year: 2019, note: "Home base 🏠", lng: 144.9631, lat: -37.8136, home: true,
    photos: [
      { url: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=600&q=80", label: "CBD Skyline" },
      { url: "https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=600&q=80", label: "Laneways" },
    ]},
  { city: "Sydney", country: "Australia", year: 2020, note: "Opera House vibes", lng: 151.2093, lat: -33.8688,
    photos: [
      { url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80", label: "Opera House" },
      { url: "https://images.unsplash.com/photo-1524820197278-540916411e20?w=600&q=80", label: "Harbour Bridge" },
    ]},
  { city: "Bali", country: "Indonesia", year: 2021, note: "Surf & chill", lng: 115.1889, lat: -8.4095,
    photos: [
      { url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", label: "Tanah Lot Temple" },
      { url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80", label: "Rice Terraces" },
    ]},
  { city: "Singapore", country: "Singapore", year: 2021, note: "Gardens by the Bay", lng: 103.8198, lat: 1.3521,
    photos: [
      { url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&q=80", label: "Gardens by the Bay" },
      { url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80", label: "Marina Bay Sands" },
    ]},
  { city: "Tokyo", country: "Japan", year: 2022, note: "Best ramen ever", lng: 139.6917, lat: 35.6895,
    photos: [
      { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", label: "Shibuya Crossing" },
      { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", label: "Mt. Fuji view" },
    ]},
  { city: "Kyoto", country: "Japan", year: 2022, note: "Temples & matcha", lng: 135.7681, lat: 35.0116,
    photos: [
      { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", label: "Fushimi Inari" },
      { url: "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?w=600&q=80", label: "Arashiyama" },
    ]},
  { city: "Bangkok", country: "Thailand", year: 2023, note: "Street food heaven", lng: 100.5018, lat: 13.7563,
    photos: [
      { url: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=80", label: "Grand Palace" },
      { url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80", label: "Street Food" },
    ]},
  { city: "New York", country: "USA", year: 2023, note: "Never sleeps", lng: -74.006, lat: 40.7128,
    photos: [
      { url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80", label: "Manhattan Skyline" },
      { url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80", label: "Central Park" },
    ]},
];

export default function Travel() {
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const mapRef = useRef<any>(null);

  const years = ["All", ...Array.from(new Set(places.map((p) => String(p.year)))).sort()];
  const filtered = filter === "All" ? places : places.filter((p) => String(p.year) === filter);

  const drawRoute = (map: any, points: typeof places) => {
    // Remove old layers
    ["route-line", "route-dashes", "route-glow"].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource("route")) map.removeSource("route");

    if (points.length < 2) return;

    const coords = points.map((p) => [p.lng, p.lat]);

    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: coords },
      },
    });

    // Glow layer
    map.addLayer({
      id: "route-glow",
      type: "line",
      source: "route",
      paint: {
        "line-color": "#60a5fa",
        "line-width": 6,
        "line-opacity": 0.15,
        "line-blur": 4,
      },
    });

    // Solid line
    map.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#60a5fa",
        "line-width": 1.5,
        "line-opacity": 0.8,
      },
    });

    // Animated dashes
    map.addLayer({
      id: "route-dashes",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#fff",
        "line-width": 1,
        "line-opacity": 0.5,
        "line-dasharray": [2, 4],
      },
    });
  };

  const handleMapLoad = () => {
    const map = mapRef.current?.getMap();
    if (map) drawRoute(map, filtered);
  };

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map && map.isStyleLoaded()) drawRoute(map, filtered);
  }, [filtered]);

  const flyTo = (lng: number, lat: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 5, duration: 1200 });
  };

  return (
    <section
      id="travel"
      className="px-12 py-28"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "monospace", color: "#555" }}>
          <span className="mr-4">06</span>Beyond the Screen
        </p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2 className="font-bold" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-2px", color: "#fff" }}>
            Travel Footprint
          </h2>
          <p style={{ fontFamily: "monospace", fontSize: 12, color: "#444" }}>
            {filtered.length} cities · {new Set(filtered.map((p) => p.country)).size} countries
          </p>
        </div>
      </div>

      {/* Year filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => { setFilter(y); setActive(null); }}
            style={{
              fontFamily: "monospace", fontSize: 11, letterSpacing: "1.5px",
              textTransform: "uppercase", padding: "6px 14px", borderRadius: 999,
              border: filter === y ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
              background: filter === y ? "rgba(255,255,255,0.08)" : "transparent",
              color: filter === y ? "#fff" : "#555",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Map + Right panel */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>

        {/* Left — Map */}
        <div style={{ height: 600, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: 80,
              latitude: 20,
              zoom: 1.8,
              pitch: 45,
              bearing: -10,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/standard"
            mapboxAccessToken={MAPBOX_TOKEN}
            onLoad={(e) => {
              const map = e.target;
              // Enable 3D buildings + lighting preset
              map.setConfigProperty("basemap", "lightPreset", "dusk");
              map.setConfigProperty("basemap", "show3dObjects", true);
              handleMapLoad();
            }}
          >
            <NavigationControl position="top-right" />
            {filtered.map((p, i) => (
              <Marker key={p.city} longitude={p.lng} latitude={p.lat} anchor="center"
                onClick={(e) => { e.originalEvent.stopPropagation(); setActive(active === i ? null : i); flyTo(p.lng, p.lat); }}
              >
                <div style={{ position: "relative", cursor: "pointer" }}>
                  <div style={{
                    position: "absolute", inset: -6, borderRadius: "50%",
                    background: (p as any).home ? "rgba(74,222,128,0.2)" : "rgba(96,165,250,0.2)",
                    animation: "tpulse 2s ease-out infinite", animationDelay: `${i * 0.2}s`,
                  }} />
                  <div style={{
                    width: active === i ? 12 : 7, height: active === i ? 12 : 7,
                    borderRadius: "50%",
                    background: (p as any).home ? "#4ade80" : "#60a5fa",
                    border: "1.5px solid rgba(255,255,255,0.4)",
                    boxShadow: active === i ? "0 0 16px rgba(96,165,250,0.8)" : "none",
                    transition: "all 0.2s",
                  }} />
                </div>
              </Marker>
            ))}
            {active !== null && filtered[active] && (
              <Popup longitude={filtered[active].lng} latitude={filtered[active].lat}
                anchor="bottom" offset={16} onClose={() => setActive(null)} closeButton={false}
              >
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 14px", minWidth: 160 }}>
                  <p style={{ fontSize: 13, color: "#fff", fontWeight: 700, margin: 0, fontFamily: "monospace" }}>{filtered[active].city}</p>
                  <p style={{ fontSize: 10, color: "#555", margin: "2px 0 0", fontFamily: "monospace" }}>{filtered[active].country} · {filtered[active].year}</p>
                  <p style={{ fontSize: 11, color: "#888", margin: "6px 0 0" }}>{filtered[active].note}</p>
                </div>
              </Popup>
            )}
          </Map>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-3" style={{ height: 600 }}>

          {/* Top — city list */}
          <div className="flex flex-col overflow-y-auto" style={{
            flex: "0 0 auto", maxHeight: 280,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {filtered.map((p, i) => (
              <div key={p.city} onClick={() => { setActive(i); flyTo(p.lng, p.lat); }}
                className="flex items-center gap-3 py-3 px-4 cursor-pointer shrink-0 transition-all duration-200"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: active === i ? "rgba(96,165,250,0.06)" : "transparent",
                }}
              >
                <span style={{ fontSize: 6, color: (p as any).home ? "#4ade80" : active === i ? "#60a5fa" : "#444" }}>●</span>
                <div>
                  <p style={{ fontSize: 13, color: active === i ? "#fff" : "#777", fontWeight: 500, transition: "color 0.2s" }}>{p.city}</p>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: "#444" }}>{p.country} · {p.year}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom — city photos */}
          <div className="flex flex-col gap-2" style={{ flex: 1 }}>
            {active !== null && filtered[active] ? (
              <>
                <p style={{ fontFamily: "monospace", fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase" }}>
                  {filtered[active].city} · Photos
                </p>
                {filtered[active].photos.map((photo, j) => (
                  <div key={j} className="relative overflow-hidden" style={{ flex: 1, minHeight: 0 }}>
                    <img src={photo.url} alt={photo.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
                    />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "8px 12px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                    }}>
                      <p style={{ fontFamily: "monospace", fontSize: 10, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>
                        {photo.label}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center h-full" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "monospace", fontSize: 11, color: "#333", letterSpacing: 2 }}>
                  SELECT A CITY
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
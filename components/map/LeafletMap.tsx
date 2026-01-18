import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

// Import geodata as base map data
import geodata from "@/geodata/18jan.json";

export interface MapMarker {
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
    price?: string;
}

export interface GeoMarker {
    Name: string;
    Category: string;
    Latitude: string;
    Longitude: string;
}

interface LeafletMapProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    markers?: MapMarker[];
    showGeoMarkers?: boolean; // Option to show/hide geodata markers
    showUserLocation?: boolean;
    onMarkerPress?: (marker: MapMarker) => void;
    onMapPress?: (lat: number, lng: number) => void;
    interactive?: boolean;
    style?: object;
}

// Cast geodata to GeoMarker type
const baseGeoMarkers: GeoMarker[] = geodata as GeoMarker[];

// Category to color and icon mapping
const getCategoryStyle = (
    category: string,
): { color: string; icon: string } => {
    const cat = category.toLowerCase();

    // Education
    if (
        cat.includes("universitas") ||
        cat.includes("perguruan tinggi") ||
        cat.includes("sekolah") ||
        cat.includes("politeknik") ||
        cat.includes("akademi") ||
        cat.includes("institut") ||
        cat.includes("smp") ||
        cat.includes("sma") ||
        cat.includes("smk") ||
        cat.includes("sd ") ||
        cat.includes("pendidikan")
    ) {
        return {
            color: "#8B5CF6",
            icon: "M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z",
        };
    }

    // Restaurant/Food
    if (
        cat.includes("restoran") ||
        cat.includes("restaurant") ||
        cat.includes("rumah makan") ||
        cat.includes("kafe") ||
        cat.includes("cafe") ||
        cat.includes("kedai") ||
        cat.includes("warung") ||
        cat.includes("padang") ||
        cat.includes("sunda") ||
        cat.includes("hidangan") ||
        cat.includes("makanan") ||
        cat.includes("ayam") ||
        cat.includes("seafood") ||
        cat.includes("mi") ||
        cat.includes("bubur") ||
        cat.includes("sate") ||
        cat.includes("nasi") ||
        cat.includes("brunch")
    ) {
        return {
            color: "#F97316",
            icon: "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z",
        };
    }

    // Bank/Finance
    if (
        cat.includes("bank") ||
        cat.includes("atm") ||
        cat.includes("keuangan") ||
        cat.includes("finance")
    ) {
        return {
            color: "#10B981",
            icon: "M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z",
        };
    }

    // Minimarket/Store
    if (
        cat.includes("minimarket") ||
        cat.includes("toko") ||
        cat.includes("mart") ||
        cat.includes("swalayan") ||
        cat.includes("toserba") ||
        cat.includes("grosir")
    ) {
        return {
            color: "#3B82F6",
            icon: "M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1v-2l-1-5zM6 18v-4h6v4H6z",
        };
    }

    // Default
    return {
        color: "#6B7280",
        icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    };
};

export default function LeafletMap({
    latitude,
    longitude,
    zoom = 15,
    markers = [],
    showGeoMarkers = true,
    showUserLocation = false,
    onMarkerPress,
    onMapPress,
    interactive = true,
    style,
}: LeafletMapProps) {
    const webViewRef = useRef<WebView>(null);

    const generateMarkerJS = useCallback(() => {
        return markers
            .map(
                (marker) => `
      L.marker([${marker.latitude}, ${marker.longitude}])
        .addTo(map)
        .bindPopup('${marker.title || ""}${marker.price ? "<br>" + marker.price : ""}')
        .on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerPress',
            marker: ${JSON.stringify(marker)}
          }));
        });
    `,
            )
            .join("\n");
    }, [markers]);

    const generateGeoMarkersJS = useCallback(() => {
        if (!showGeoMarkers) return "";
        return baseGeoMarkers
            .map((geo: GeoMarker) => {
                const { color, icon } = getCategoryStyle(geo.Category);
                const safeName = geo.Name.replace(/'/g, "\\'").replace(
                    /"/g,
                    '\\"',
                );
                return `
      (function() {
        var icon = L.divIcon({
          className: 'geo-marker-container',
          html: '<div class="geo-marker-wrapper"><div class="geo-label" style="color:${color};">${safeName}</div><div class="geo-pin" style="background:${color};"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="white" d="${icon}"/></svg></div></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 20]
        });
        L.marker([${geo.Latitude}, ${geo.Longitude}], {icon: icon}).addTo(geoLayer);
      })();
    `;
            })
            .join("\n");
    }, [showGeoMarkers]);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; font-family: 'Manrope', sans-serif; }
        html, body, #map { height: 100%; width: 100%; }
        
        .geo-marker-container {
          background: transparent !important;
          border: none !important;
        }
        
        .geo-marker-wrapper {
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
          position: relative;
        }
        
        .geo-pin {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          flex-shrink: 0;
        }
        
        .geo-label {
          position: absolute;
          right: 28px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          pointer-events: none;
          -webkit-text-stroke: 2px white;
          paint-order: stroke fill;
          text-shadow: 
            1px 1px 0 white,
            -1px -1px 0 white,
            1px -1px 0 white,
            -1px 1px 0 white,
            0 1px 0 white,
            0 -1px 0 white,
            1px 0 0 white,
            -1px 0 0 white;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          dragging: ${interactive},
          touchZoom: ${interactive},
          scrollWheelZoom: ${interactive},
          doubleClickZoom: ${interactive},
        }).setView([${latitude}, ${longitude}], ${zoom});
        
        // CartoCDN Light - clean map style
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© CartoDB © OSM',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);

        // Layer for geo markers
        var geoLayer = L.layerGroup();
        var geoMarkersLoaded = false;
        var MIN_ZOOM_FOR_MARKERS = 15; // Only show markers at this zoom level or higher
        
        function loadGeoMarkers() {
          if (geoMarkersLoaded) return;
          geoMarkersLoaded = true;
          ${generateGeoMarkersJS()}
        }
        
        function updateGeoLayerVisibility() {
          var currentZoom = map.getZoom();
          if (currentZoom >= MIN_ZOOM_FOR_MARKERS) {
            loadGeoMarkers();
            if (!map.hasLayer(geoLayer)) {
              map.addLayer(geoLayer);
            }
          } else {
            if (map.hasLayer(geoLayer)) {
              map.removeLayer(geoLayer);
            }
          }
        }
        
        // Check on initial load
        updateGeoLayerVisibility();
        
        // Update on zoom change
        map.on('zoomend', updateGeoLayerVisibility);

        ${generateMarkerJS()}
        
        ${
            showUserLocation
                ? `
          map.locate({setView: false, maxZoom: 16});
          map.on('locationfound', function(e) {
            L.circleMarker(e.latlng, {
              radius: 8,
              fillColor: "#4285F4",
              color: "#ffffff",
              weight: 2,
              opacity: 1,
              fillOpacity: 1
            }).addTo(map);
          });
        `
                : ""
        }
        
        ${
            onMapPress
                ? `
          map.on('click', function(e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapPress',
              lat: e.latlng.lat,
              lng: e.latlng.lng
            }));
          });
        `
                : ""
        }
      </script>
    </body>
    </html>
  `;

    const handleMessage = (event: WebViewMessageEvent) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "markerPress" && onMarkerPress) {
                onMarkerPress(data.marker);
            } else if (data.type === "mapPress" && onMapPress) {
                onMapPress(data.lat, data.lng);
            }
        } catch (e) {
            console.error("Error parsing WebView message:", e);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <WebView
                ref={webViewRef}
                source={{ html: htmlContent }}
                style={styles.webview}
                onMessage={handleMessage}
                scrollEnabled={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    webview: {
        flex: 1,
    },
});

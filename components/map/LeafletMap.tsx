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
    showGeoMarkers?: boolean;
    showUserLocation?: boolean;
    onMarkerPress?: (marker: MapMarker) => void;
    onMapPress?: (lat: number, lng: number) => void;
    interactive?: boolean;
    style?: object;
}

// Cast geodata to GeoMarker type
const baseGeoMarkers: GeoMarker[] = geodata as GeoMarker[];

// Category configuration: color, icon, and minimum zoom level to display
const getCategoryConfig = (
    category: string,
): { color: string; icon: string; minZoom: number; priority: number } => {
    const cat = category.toLowerCase();

    // Education - Major POIs, show earlier (zoom 13+)
    if (
        cat.includes("universitas") ||
        cat.includes("perguruan tinggi") ||
        cat.includes("politeknik") ||
        cat.includes("akademi") ||
        cat.includes("institut")
    ) {
        return {
            color: "#8B5CF6",
            icon: "M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z",
            minZoom: 13,
            priority: 1,
        };
    }

    // Schools - Show at zoom 15+
    if (
        cat.includes("sekolah") ||
        cat.includes("smp") ||
        cat.includes("sma") ||
        cat.includes("smk") ||
        cat.includes("sd ") ||
        cat.includes("pendidikan")
    ) {
        return {
            color: "#8B5CF6",
            icon: "M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z",
            minZoom: 15,
            priority: 2,
        };
    }

    // Bank - Important, show at zoom 14+
    if (
        cat.includes("bank") ||
        cat.includes("atm") ||
        cat.includes("keuangan") ||
        cat.includes("finance")
    ) {
        return {
            color: "#10B981",
            icon: "M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z",
            minZoom: 14,
            priority: 2,
        };
    }

    // Restaurant/Food - Show at zoom 15+
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
            minZoom: 15,
            priority: 3,
        };
    }

    // Minimarket/Store - Show at zoom 16+
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
            minZoom: 16,
            priority: 4,
        };
    }

    // Default - Show at zoom 17+
    return {
        color: "#6B7280",
        icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        minZoom: 17,
        priority: 5,
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

    // Generate geodata as JSON for dynamic filtering
    const geoDataJSON = showGeoMarkers
        ? JSON.stringify(
              baseGeoMarkers.map((geo) => {
                  const config = getCategoryConfig(geo.Category);
                  return {
                      name: geo.Name,
                      category: geo.Category,
                      lat: parseFloat(geo.Latitude),
                      lng: parseFloat(geo.Longitude),
                      color: config.color,
                      icon: config.icon,
                      minZoom: config.minZoom,
                      priority: config.priority,
                  };
              }),
          )
        : "[]";

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
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
          opacity: 0;
          animation: fadeIn 0.3s ease forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
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
        
        /* Custom cluster styles */
        .marker-cluster-small {
          background-color: rgba(27, 152, 141, 0.6);
        }
        .marker-cluster-small div {
          background-color: rgba(27, 152, 141, 0.8);
        }
        .marker-cluster-medium {
          background-color: rgba(27, 152, 141, 0.6);
        }
        .marker-cluster-medium div {
          background-color: rgba(27, 152, 141, 0.8);
        }
        .marker-cluster-large {
          background-color: rgba(27, 152, 141, 0.6);
        }
        .marker-cluster-large div {
          background-color: rgba(27, 152, 141, 0.8);
        }
        .marker-cluster {
          background-clip: padding-box;
          border-radius: 20px;
        }
        .marker-cluster div {
          width: 30px;
          height: 30px;
          margin-left: 5px;
          margin-top: 5px;
          text-align: center;
          border-radius: 15px;
          font: 12px 'Manrope', sans-serif;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-cluster span {
          line-height: 30px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Geodata with zoom configuration
        var geoData = ${geoDataJSON};
        
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

        // Marker cluster group for geo markers
        var clusterGroup = L.markerClusterGroup({
          maxClusterRadius: 50,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          disableClusteringAtZoom: 17,
          iconCreateFunction: function(cluster) {
            var count = cluster.getChildCount();
            var size = count < 10 ? 'small' : count < 50 ? 'medium' : 'large';
            return L.divIcon({
              html: '<div><span>' + count + '</span></div>',
              className: 'marker-cluster marker-cluster-' + size,
              iconSize: L.point(40, 40)
            });
          }
        });
        
        // Store all markers for filtering
        var allGeoMarkers = [];
        var currentVisibleMarkers = [];
        
        // Create markers for all geodata
        geoData.forEach(function(geo, index) {
          var icon = L.divIcon({
            className: 'geo-marker-container',
            html: '<div class="geo-marker-wrapper"><div class="geo-label" style="color:' + geo.color + ';">' + geo.name.replace(/'/g, "\\\\'") + '</div><div class="geo-pin" style="background:' + geo.color + ';"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="white" d="' + geo.icon + '"/></svg></div></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 20]
          });
          
          var marker = L.marker([geo.lat, geo.lng], { icon: icon });
          marker.geoData = geo;
          marker.geoIndex = index;
          allGeoMarkers.push(marker);
        });
        
        // Function to update visible markers based on zoom and viewport
        function updateVisibleMarkers() {
          var currentZoom = map.getZoom();
          var bounds = map.getBounds();
          
          // Clear cluster group
          clusterGroup.clearLayers();
          currentVisibleMarkers = [];
          
          // Filter markers by zoom level and viewport
          allGeoMarkers.forEach(function(marker) {
            var geo = marker.geoData;
            var latlng = marker.getLatLng();
            
            // Check if marker should be visible at current zoom
            if (currentZoom >= geo.minZoom) {
              // Check if marker is within viewport (with padding)
              var paddedBounds = bounds.pad(0.2); // 20% padding
              if (paddedBounds.contains(latlng)) {
                currentVisibleMarkers.push(marker);
                clusterGroup.addLayer(marker);
              }
            }
          });
        }
        
        // Add cluster group to map
        map.addLayer(clusterGroup);
        
        // Initial update
        updateVisibleMarkers();
        
        // Update on zoom and move
        map.on('zoomend', updateVisibleMarkers);
        map.on('moveend', updateVisibleMarkers);

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

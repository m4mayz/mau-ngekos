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

// Category configuration: color, icon, minimum zoom level, and priority (lower = more important)
const getCategoryConfig = (
    category: string,
): { color: string; icon: string; minZoom: number; priority: number } => {
    const cat = category.toLowerCase();

    // Education - Major POIs, highest priority
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

    // Schools
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

    // Bank - Important
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
            minZoom: 15,
            priority: 3,
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
            minZoom: 16,
            priority: 4,
        };
    }

    // Default
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
          position: relative;
          width: 28px;
          height: 28px;
        }
        
        .geo-pin {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        
        .geo-label {
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          pointer-events: none;
          text-shadow: 
            -1px -1px 0 white,
            1px -1px 0 white,
            -1px 1px 0 white,
            1px 1px 0 white,
            0 -1px 0 white,
            0 1px 0 white,
            -1px 0 0 white,
            1px 0 0 white;
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

        // Layer for geo markers
        var geoLayer = L.layerGroup().addTo(map);
        
        // Minimum pixel distance between markers to avoid overlap
        var MIN_MARKER_DISTANCE = 40;
        // Pixel distance to check for label collision (text width)
        var LABEL_COLLISION_DISTANCE = 80;
        
        // Convert lat/lng to pixel position
        function latLngToPixel(lat, lng) {
          var point = map.latLngToContainerPoint([lat, lng]);
          return { x: point.x, y: point.y };
        }
        
        // Calculate pixel distance between two points
        function pixelDistance(p1, p2) {
          var dx = p1.x - p2.x;
          var dy = p1.y - p2.y;
          return Math.sqrt(dx * dx + dy * dy);
        }
        
        // Check if a marker has another marker to its left (for label positioning)
        function hasMarkerOnLeft(visibleMarkers, currentIndex, currentPixel) {
          for (var i = 0; i < visibleMarkers.length; i++) {
            if (i === currentIndex) continue;
            var otherPixel = visibleMarkers[i].pixel;
            // Check if marker is to the left and within label collision range
            var dx = currentPixel.x - otherPixel.x;
            var dy = Math.abs(currentPixel.y - otherPixel.y);
            if (dx > 0 && dx < LABEL_COLLISION_DISTANCE && dy < 20) {
              return true;
            }
          }
          return false;
        }
        
        // Filter overlapping markers, keeping only the most important one
        function filterOverlappingMarkers(candidates) {
          // Sort by priority (lower = more important)
          candidates.sort(function(a, b) {
            return a.geo.priority - b.geo.priority;
          });
          
          var visible = [];
          
          for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            var isOverlapping = false;
            
            // Check against already accepted markers
            for (var j = 0; j < visible.length; j++) {
              var distance = pixelDistance(candidate.pixel, visible[j].pixel);
              if (distance < MIN_MARKER_DISTANCE) {
                isOverlapping = true;
                break;
              }
            }
            
            if (!isOverlapping) {
              visible.push(candidate);
            }
          }
          
          return visible;
        }
        
        // Create marker element with label on left of pin
        function createMarkerIcon(geo) {
          var safeName = geo.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
          
          // Pin is 28x28, label is positioned absolutely to the left
          // iconAnchor should be center of the 28x28 wrapper (14, 14)
          return L.divIcon({
            className: 'geo-marker-container',
            html: '<div class="geo-marker-wrapper"><div class="geo-label" style="color:' + geo.color + ';">' + safeName + '</div><div class="geo-pin" style="background:' + geo.color + ';"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="white" d="' + geo.icon + '"/></svg></div></div>',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });
        }
        
        // Update visible markers based on zoom, viewport, and overlap
        function updateVisibleMarkers() {
          var currentZoom = map.getZoom();
          var bounds = map.getBounds();
          var paddedBounds = bounds.pad(0.1);
          
          // Clear previous markers
          geoLayer.clearLayers();
          
          // Step 1: Get candidates that meet zoom level and are in viewport
          var candidates = [];
          geoData.forEach(function(geo, index) {
            if (currentZoom >= geo.minZoom && paddedBounds.contains([geo.lat, geo.lng])) {
              var pixel = latLngToPixel(geo.lat, geo.lng);
              candidates.push({
                geo: geo,
                pixel: pixel,
                index: index
              });
            }
          });
          
          // Step 2: Filter overlapping markers
          var visibleMarkers = filterOverlappingMarkers(candidates);
          
          // Step 3: Create markers
          visibleMarkers.forEach(function(item) {
            var icon = createMarkerIcon(item.geo);
            var marker = L.marker([item.geo.lat, item.geo.lng], { icon: icon });
            geoLayer.addLayer(marker);
          });
        }
        
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

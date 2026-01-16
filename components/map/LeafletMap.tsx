import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

export interface MapMarker {
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
    price?: string;
}

interface LeafletMapProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    markers?: MapMarker[];
    showUserLocation?: boolean;
    onMarkerPress?: (marker: MapMarker) => void;
    onMapPress?: (lat: number, lng: number) => void;
    interactive?: boolean;
    style?: object;
}

export default function LeafletMap({
    latitude,
    longitude,
    zoom = 15,
    markers = [],
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
    `
            )
            .join("\n");
    }, [markers]);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; }
        html, body, #map { height: 100%; width: 100%; }
        .custom-marker {
          background: #6366F1;
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .marker-arrow {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #6366F1;
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: ${interactive},
          dragging: ${interactive},
          touchZoom: ${interactive},
          scrollWheelZoom: ${interactive},
          doubleClickZoom: ${interactive},
        }).setView([${latitude}, ${longitude}], ${zoom});
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

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

    const updateCenter = (lat: number, lng: number) => {
        webViewRef.current?.injectJavaScript(`
      map.setView([${lat}, ${lng}], map.getZoom());
      true;
    `);
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

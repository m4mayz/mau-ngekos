import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

interface LocationPickerMapProps {
    latitude: number;
    longitude: number;
    onLocationChange: (lat: number, lng: number) => void;
    style?: object;
}

export default function LocationPickerMap({
    latitude,
    longitude,
    onLocationChange,
    style,
}: LocationPickerMapProps) {
    const webViewRef = useRef<WebView>(null);
    const [currentLat, setCurrentLat] = useState(latitude);
    const [currentLng, setCurrentLng] = useState(longitude);

    useEffect(() => {
        if (latitude !== currentLat || longitude !== currentLng) {
            setCurrentLat(latitude);
            setCurrentLng(longitude);
            webViewRef.current?.injectJavaScript(`
        marker.setLatLng([${latitude}, ${longitude}]);
        map.setView([${latitude}, ${longitude}], map.getZoom());
        true;
      `);
        }
    }, [latitude, longitude]);

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
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${latitude}, ${longitude}], 16);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        var marker = L.marker([${latitude}, ${longitude}], {
          draggable: true
        }).addTo(map);

        marker.on('dragend', function(e) {
          var pos = marker.getLatLng();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'locationChange',
            lat: pos.lat,
            lng: pos.lng
          }));
        });

        map.on('click', function(e) {
          marker.setLatLng(e.latlng);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'locationChange',
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }));
        });
      </script>
    </body>
    </html>
  `;

    const handleMessage = (event: WebViewMessageEvent) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "locationChange") {
                onLocationChange(data.lat, data.lng);
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
        borderRadius: 12,
    },
    webview: {
        flex: 1,
    },
});

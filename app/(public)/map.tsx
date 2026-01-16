import LeafletMap, { MapMarker } from "@/components/map/LeafletMap";
import Text from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { BoardingHouse } from "@/types/database";
import { Monicon } from "@monicon/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function PublicMapScreen() {
    const router = useRouter();
    const [houses, setHouses] = useState<BoardingHouse[]>([]);
    const [userLocation, setUserLocation] = useState({
        latitude: -6.2088,
        longitude: 106.8456,
    });

    useEffect(() => {
        fetchApprovedHouses();
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.log("Could not get location");
        }
    };

    const fetchApprovedHouses = async () => {
        try {
            const { data, error } = await supabase
                .from("boarding_houses")
                .select("*")
                .eq("status", "approved");

            if (data && !error) {
                setHouses(data);
            }
        } catch (error) {
            console.error("Error fetching houses:", error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const markers: MapMarker[] = houses.map((house) => ({
        id: house.id,
        latitude: house.latitude,
        longitude: house.longitude,
        title: house.name,
        price: formatPrice(house.price_per_month) + "/bln",
    }));

    return (
        <View className="flex-1 bg-gray-100">
            <LeafletMap
                latitude={userLocation.latitude}
                longitude={userLocation.longitude}
                zoom={14}
                markers={markers}
                showUserLocation
                style={StyleSheet.absoluteFillObject}
            />

            {/* Header */}
            <View className="absolute left-4 right-4 top-12">
                <View className="flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-lg">
                    <Monicon
                        name="material-symbols:search-rounded"
                        size={24}
                        color="#6B7280"
                    />
                    <Text className="ml-3 flex-1 text-gray-400">
                        Cari lokasi kos...
                    </Text>
                </View>
            </View>

            {/* Login Button */}
            <View className="absolute bottom-8 left-4 right-4">
                <TouchableOpacity
                    onPress={() => router.push("/(auth)/login")}
                    className="flex-row items-center justify-center rounded-2xl bg-primary py-4 shadow-lg"
                >
                    <Monicon
                        name="material-symbols:login-rounded"
                        size={24}
                        color="#ffffff"
                    />
                    <Text weight="semibold" className="ml-2 text-lg text-white">
                        Login untuk Fitur Lengkap
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

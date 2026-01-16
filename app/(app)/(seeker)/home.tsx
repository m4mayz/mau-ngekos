import LeafletMap, { MapMarker } from "@/components/map/LeafletMap";
import Text from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { BoardingHouse } from "@/types/database";
import { Monicon } from "@monicon/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Linking,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SeekerHomeScreen() {
    const router = useRouter();
    const [houses, setHouses] = useState<BoardingHouse[]>([]);
    const [filteredHouses, setFilteredHouses] = useState<BoardingHouse[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHouse, setSelectedHouse] = useState<BoardingHouse | null>(
        null
    );
    const [showFilter, setShowFilter] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
    const [userLocation, setUserLocation] = useState({
        latitude: -6.2088,
        longitude: 106.8456,
    });

    useEffect(() => {
        fetchHouses();
        getCurrentLocation();
    }, []);

    useEffect(() => {
        filterHouses();
    }, [searchQuery, houses, priceRange]);

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

    const fetchHouses = async () => {
        const { data, error } = await supabase
            .from("boarding_houses")
            .select("*")
            .eq("status", "approved");

        if (data && !error) {
            setHouses(data);
            setFilteredHouses(data);
        }
    };

    const filterHouses = useCallback(() => {
        let result = houses;

        if (searchQuery) {
            result = result.filter(
                (h) =>
                    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    h.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        result = result.filter(
            (h) =>
                h.price_per_month >= priceRange.min &&
                h.price_per_month <= priceRange.max
        );

        setFilteredHouses(result);
    }, [searchQuery, houses, priceRange]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const openWhatsApp = (phone: string, houseName: string) => {
        const message = encodeURIComponent(
            `Halo, saya tertarik dengan kos "${houseName}" yang ada di MauNgekos. Apakah masih tersedia?`
        );
        Linking.openURL(
            `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`
        );
    };

    const markers: MapMarker[] = filteredHouses.map((house) => ({
        id: house.id,
        latitude: house.latitude,
        longitude: house.longitude,
        title: house.name,
        price: formatPrice(house.price_per_month) + "/bln",
    }));

    const handleMarkerPress = (marker: MapMarker) => {
        const house = houses.find((h) => h.id === marker.id);
        if (house) setSelectedHouse(house);
    };

    return (
        <View className="flex-1 bg-gray-100">
            <LeafletMap
                latitude={userLocation.latitude}
                longitude={userLocation.longitude}
                zoom={14}
                markers={markers}
                showUserLocation
                onMarkerPress={handleMarkerPress}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Search Bar */}
            <View className="absolute left-4 right-4 top-12">
                <View className="flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-lg">
                    <Monicon
                        name="material-symbols:search-rounded"
                        size={24}
                        color="#6B7280"
                    />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Cari nama atau alamat kos..."
                        className="ml-3 flex-1 text-gray-900"
                        placeholderTextColor="#9CA3AF"
                        style={{ fontFamily: "Manrope_400Regular" }}
                    />
                    <TouchableOpacity onPress={() => setShowFilter(true)}>
                        <Monicon
                            name="material-symbols:tune-rounded"
                            size={24}
                            color="#6366F1"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Selected House Card */}
            {selectedHouse && (
                <View className="absolute bottom-24 left-4 right-4">
                    <View className="rounded-2xl bg-white p-4 shadow-lg">
                        <View className="flex-row items-start justify-between">
                            <View className="flex-1">
                                <Text
                                    weight="bold"
                                    className="text-lg text-gray-900"
                                >
                                    {selectedHouse.name}
                                </Text>
                                <Text
                                    className="mt-1 text-gray-500"
                                    numberOfLines={2}
                                >
                                    {selectedHouse.address}
                                </Text>
                                <Text
                                    weight="bold"
                                    className="mt-2 text-xl text-primary"
                                >
                                    {formatPrice(selectedHouse.price_per_month)}
                                    <Text className="text-sm text-gray-500">
                                        /bulan
                                    </Text>
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setSelectedHouse(null)}
                                className="p-2"
                            >
                                <Monicon
                                    name="material-symbols:close-rounded"
                                    size={20}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                        </View>
                        <View className="mt-4 flex-row gap-3">
                            <TouchableOpacity
                                onPress={() =>
                                    router.push(
                                        `/(app)/(seeker)/kos/${selectedHouse.id}`
                                    )
                                }
                                className="flex-1 flex-row items-center justify-center rounded-xl bg-gray-100 py-3"
                            >
                                <Monicon
                                    name="material-symbols:visibility-rounded"
                                    size={20}
                                    color="#374151"
                                />
                                <Text
                                    weight="medium"
                                    className="ml-2 text-gray-700"
                                >
                                    Detail
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    openWhatsApp(
                                        selectedHouse.whatsapp_number,
                                        selectedHouse.name
                                    )
                                }
                                className="flex-1 flex-row items-center justify-center rounded-xl bg-green-500 py-3"
                            >
                                <Monicon
                                    name="mdi:whatsapp"
                                    size={20}
                                    color="#ffffff"
                                />
                                <Text
                                    weight="medium"
                                    className="ml-2 text-white"
                                >
                                    WhatsApp
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Filter Modal */}
            <Modal visible={showFilter} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/50">
                    <View className="rounded-t-3xl bg-white p-6">
                        <View className="mb-6 flex-row items-center justify-between">
                            <Text
                                weight="bold"
                                className="text-xl text-gray-900"
                            >
                                Filter Harga
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowFilter(false)}
                            >
                                <Monicon
                                    name="material-symbols:close-rounded"
                                    size={24}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-4">
                            <Text
                                weight="medium"
                                className="mb-2 text-gray-700"
                            >
                                Harga Minimum
                            </Text>
                            <TextInput
                                value={priceRange.min.toString()}
                                onChangeText={(v) =>
                                    setPriceRange({
                                        ...priceRange,
                                        min: parseInt(v) || 0,
                                    })
                                }
                                keyboardType="numeric"
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                                placeholder="0"
                                style={{ fontFamily: "Manrope_400Regular" }}
                            />
                        </View>

                        <View className="mb-6">
                            <Text
                                weight="medium"
                                className="mb-2 text-gray-700"
                            >
                                Harga Maksimum
                            </Text>
                            <TextInput
                                value={priceRange.max.toString()}
                                onChangeText={(v) =>
                                    setPriceRange({
                                        ...priceRange,
                                        max: parseInt(v) || 10000000,
                                    })
                                }
                                keyboardType="numeric"
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                                placeholder="10000000"
                                style={{ fontFamily: "Manrope_400Regular" }}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => setShowFilter(false)}
                            className="items-center rounded-xl bg-primary py-4"
                        >
                            <Text weight="semibold" className="text-white">
                                Terapkan Filter
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

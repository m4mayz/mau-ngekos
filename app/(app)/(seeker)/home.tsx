import FacilitiesFilterDialog from "@/components/filter/FacilitiesFilterDialog";
import PriceFilterDialog from "@/components/filter/PriceFilterDialog";
import TypeFilterDialog from "@/components/filter/TypeFilterDialog";
import LeafletMap, { MapMarker } from "@/components/map/LeafletMap";
import FilterChip from "@/components/ui/FilterChip";
import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import {
    FirestoreBoardingHouse,
    getBoardingHousesByStatus,
} from "@/lib/firestore";
import { Monicon } from "@monicon/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Filter state interface
interface FilterState {
    minPrice?: number;
    maxPrice?: number;
    kosType: "putra" | "putri" | "campur" | null;
    roomFacilities: string[];
    sharedFacilities: string[];
    onlyAvailable: boolean;
}

export default function SeekerHomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { firebaseUser } = useAuth();
    const [houses, setHouses] = useState<FirestoreBoardingHouse[]>([]);
    const [filteredHouses, setFilteredHouses] = useState<
        FirestoreBoardingHouse[]
    >([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHouse, setSelectedHouse] =
        useState<FirestoreBoardingHouse | null>(null);
    const [userLocation, setUserLocation] = useState({
        latitude: -6.9187,
        longitude: 106.9268,
    });
    const [filters, setFilters] = useState<FilterState>({
        minPrice: undefined,
        maxPrice: undefined,
        kosType: null,
        roomFacilities: [],
        sharedFacilities: [],
        onlyAvailable: false,
    });

    useEffect(() => {
        fetchHouses();
        getCurrentLocation();
    }, []);

    useEffect(() => {
        filterHouses();
    }, [searchQuery, houses, filters]);

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
        try {
            const data = await getBoardingHousesByStatus("approved");
            setHouses(data);
            setFilteredHouses(data);
        } catch (error) {
            console.error("Error fetching houses:", error);
        }
    };

    const filterHouses = useCallback(() => {
        let result = houses;

        // Search filter
        if (searchQuery) {
            result = result.filter(
                (h) =>
                    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    h.address.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Price filter
        if (filters.minPrice) {
            result = result.filter(
                (h) => h.price_per_month >= filters.minPrice!,
            );
        }
        if (filters.maxPrice) {
            result = result.filter(
                (h) => h.price_per_month <= filters.maxPrice!,
            );
        }

        // Kos type filter
        if (filters.kosType) {
            result = result.filter((h) => h.kos_type === filters.kosType);
        }

        // Room facilities filter
        if (filters.roomFacilities.length > 0) {
            result = result.filter((h) =>
                filters.roomFacilities.every((f) =>
                    h.room_facilities?.includes(f),
                ),
            );
        }

        // Shared facilities filter
        if (filters.sharedFacilities.length > 0) {
            result = result.filter((h) =>
                filters.sharedFacilities.every((f) =>
                    h.shared_facilities?.includes(f),
                ),
            );
        }

        // Available rooms filter
        if (filters.onlyAvailable) {
            result = result.filter((h) => (h.available_rooms ?? 0) > 0);
        }

        setFilteredHouses(result);
    }, [searchQuery, houses, filters]);

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `Rp ${(price / 1000000).toFixed(1)}jt`;
        }
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const openWhatsApp = (phone: string, houseName: string) => {
        const message = encodeURIComponent(
            `Halo, saya tertarik dengan kos "${houseName}" yang ada di MauNgekos. Apakah masih tersedia?`,
        );
        Linking.openURL(
            `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`,
        );
    };

    const markers: MapMarker[] = filteredHouses.map((house) => ({
        id: house.id,
        latitude: house.latitude,
        longitude: house.longitude,
        title: house.name,
        price: formatPrice(house.price_per_month),
    }));

    const handleMarkerPress = (marker: MapMarker) => {
        const house = houses.find((h) => h.id === marker.id);
        if (house) setSelectedHouse(house);
    };

    const handleCloseCard = () => {
        setSelectedHouse(null);
    };

    return (
        <View className="flex-1 bg-gray-100">
            {/* Map Layer */}
            <LeafletMap
                latitude={userLocation.latitude}
                longitude={userLocation.longitude}
                zoom={14}
                markers={markers}
                showUserLocation
                onMarkerPress={handleMarkerPress}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Top UI Layer */}
            <View
                style={{ paddingTop: insets.top + 12, paddingHorizontal: 16 }}
            >
                {/* Search Bar */}
                <View
                    className="flex-row items-center h-14 bg-white rounded-full px-4"
                    style={{
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        shadowColor: "#000",
                        elevation: 10,
                        backgroundColor: "#fff",
                    }}
                >
                    {/* MauNgekos Icon */}
                    <View className="w-9 h-9 overflow-hidden items-center justify-center mr-3">
                        <Image
                            source={require("@/assets/images/icon-no-bg2.png")}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                        />
                    </View>

                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Cari kos di sekitarmu..."
                        className="flex-1 text-gray-900"
                        placeholderTextColor="#9CA3AF"
                        style={{
                            fontFamily: "Manrope_400Regular",
                            fontSize: 16,
                        }}
                    />

                    {/* Profile Button or Login */}
                    {firebaseUser ? (
                        <TouchableOpacity
                            onPress={() => router.push("/(app)/profile")}
                            className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center overflow-hidden border border-gray-200"
                        >
                            <Monicon
                                name="material-symbols:person-rounded"
                                size={22}
                                color="#1b988d"
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/login")}
                            className="px-3 py-1.5 rounded-full bg-primary"
                        >
                            <Text
                                weight="semibold"
                                className="text-xs text-white"
                            >
                                Masuk
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-3"
                    contentContainerStyle={{ paddingRight: 16 }}
                >
                    <PriceFilterDialog
                        minPrice={filters.minPrice}
                        maxPrice={filters.maxPrice}
                        onApply={(min, max) =>
                            setFilters((p) => ({
                                ...p,
                                minPrice: min,
                                maxPrice: max,
                            }))
                        }
                    />
                    <TypeFilterDialog
                        value={filters.kosType}
                        onApply={(type) =>
                            setFilters((p) => ({ ...p, kosType: type }))
                        }
                    />
                    <FacilitiesFilterDialog
                        roomFacilities={filters.roomFacilities}
                        sharedFacilities={filters.sharedFacilities}
                        onApply={(room, shared) =>
                            setFilters((p) => ({
                                ...p,
                                roomFacilities: room,
                                sharedFacilities: shared,
                            }))
                        }
                    />
                    <FilterChip
                        label="Tersedia"
                        hasValue={filters.onlyAvailable}
                        onPress={() =>
                            setFilters((p) => ({
                                ...p,
                                onlyAvailable: !p.onlyAvailable,
                            }))
                        }
                        showDropdown={false}
                    />
                </ScrollView>
            </View>

            {/* FAB - My Location */}
            <TouchableOpacity
                onPress={getCurrentLocation}
                className="absolute right-5 h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg"
                style={{ bottom: selectedHouse ? 380 : 90 }}
            >
                <Monicon
                    name="material-symbols:my-location-rounded"
                    size={24}
                    color="#ffffff"
                />
            </TouchableOpacity>

            {/* Detail Card - appears when marker is selected */}
            {selectedHouse && (
                <View
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
                    style={{ paddingBottom: 16 }}
                >
                    {/* Drag Handle */}
                    <TouchableOpacity
                        onPress={handleCloseCard}
                        className="w-full items-center py-3"
                    >
                        <View className="w-10 h-1.5 rounded-full bg-gray-300" />
                    </TouchableOpacity>

                    {/* Card Content */}
                    <View className="px-5">
                        {/* Image Placeholder */}
                        <View className="relative w-full h-40 rounded-2xl bg-gray-200 overflow-hidden mb-4">
                            <View className="absolute top-3 right-3 bg-black/40 p-2 rounded-full">
                                <Monicon
                                    name="material-symbols:favorite-rounded"
                                    size={18}
                                    color="#ffffff"
                                />
                            </View>
                            <View className="flex-1 items-center justify-center">
                                <Monicon
                                    name="material-symbols:image-rounded"
                                    size={48}
                                    color="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* Details */}
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-1 pr-4">
                                <Text
                                    weight="bold"
                                    className="text-xl text-gray-900"
                                >
                                    {selectedHouse.name}
                                </Text>
                                <Text
                                    className="text-sm text-gray-500 mt-1"
                                    numberOfLines={1}
                                >
                                    {selectedHouse.address}
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text
                                    weight="bold"
                                    className="text-lg text-primary"
                                >
                                    {formatPrice(selectedHouse.price_per_month)}
                                </Text>
                                <Text className="text-xs text-gray-400">
                                    / bulan
                                </Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3 mt-2">
                            <TouchableOpacity
                                onPress={() =>
                                    openWhatsApp(
                                        selectedHouse.whatsapp_number,
                                        selectedHouse.name,
                                    )
                                }
                                className="flex-1 flex-row items-center justify-center h-12 rounded-xl bg-green-500"
                            >
                                <Monicon
                                    name="mdi:whatsapp"
                                    size={20}
                                    color="#ffffff"
                                />
                                <Text
                                    weight="semibold"
                                    className="ml-2 text-white"
                                >
                                    WhatsApp
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    router.push(
                                        `/(app)/(seeker)/kos/${selectedHouse.id}`,
                                    )
                                }
                                className="flex-1 flex-row items-center justify-center h-12 rounded-xl bg-primary"
                            >
                                <Text weight="semibold" className="text-white">
                                    Lihat Detail
                                </Text>
                                <View className="ml-2">
                                    <Monicon
                                        name="material-symbols:arrow-forward-rounded"
                                        size={20}
                                        color="#ffffff"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

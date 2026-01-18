import LocationPickerMap from "@/components/map/LocationPickerMap";
import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { createBoardingHouse } from "@/lib/firestore";
import { Monicon } from "@monicon/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddListingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { firebaseUser } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        address: "",
        whatsapp: "",
    });
    const [coordinate, setCoordinate] = useState({
        latitude: -6.2088,
        longitude: 106.8456,
    });

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Info",
                    "Izin lokasi diperlukan untuk menentukan lokasi kos",
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setCoordinate({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.log("Could not get location");
        }
    };

    const handleLocationChange = (lat: number, lng: number) => {
        setCoordinate({ latitude: lat, longitude: lng });
    };

    const handleSubmit = async () => {
        if (!firebaseUser) {
            Alert.alert("Error", "Anda harus login terlebih dahulu");
            return;
        }

        if (!form.name || !form.price || !form.address || !form.whatsapp) {
            Alert.alert("Error", "Mohon lengkapi semua data yang wajib diisi");
            return;
        }

        setIsLoading(true);
        try {
            await createBoardingHouse({
                owner_id: firebaseUser.uid,
                name: form.name,
                description: form.description || null,
                price_per_month: parseInt(form.price),
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                address: form.address,
                whatsapp_number: form.whatsapp,
                status: "pending",
            });

            Alert.alert(
                "Sukses",
                "Kos berhasil didaftarkan! Menunggu persetujuan admin.",
                [{ text: "OK", onPress: () => router.back() }],
            );
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Gagal mendaftarkan kos");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
        >
            <View
                className="flex-row items-center border-b border-gray-100 px-4 pb-4"
                style={{ paddingTop: insets.top + 8 }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                >
                    <Monicon
                        name="material-symbols:arrow-back-rounded"
                        size={24}
                        color="#374151"
                    />
                </TouchableOpacity>
                <Text weight="bold" className="text-xl text-gray-900">
                    Tambah Kos Baru
                </Text>
            </View>

            <ScrollView
                className="flex-1 px-6 pt-6"
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-4">
                    <Text
                        weight="medium"
                        className="mb-2 text-sm text-gray-700"
                    >
                        Nama Kos <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        value={form.name}
                        onChangeText={(v) => setForm({ ...form, name: v })}
                        placeholder="Contoh: Kos Pak Budi"
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                        placeholderTextColor="#9CA3AF"
                        style={{ fontFamily: "Manrope_400Regular" }}
                    />
                </View>

                <View className="mb-4">
                    <Text
                        weight="medium"
                        className="mb-2 text-sm text-gray-700"
                    >
                        Deskripsi
                    </Text>
                    <TextInput
                        value={form.description}
                        onChangeText={(v) =>
                            setForm({ ...form, description: v })
                        }
                        placeholder="Deskripsi singkat tentang kos..."
                        multiline
                        numberOfLines={4}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                        placeholderTextColor="#9CA3AF"
                        style={{
                            textAlignVertical: "top",
                            minHeight: 100,
                            fontFamily: "Manrope_400Regular",
                        }}
                    />
                </View>

                <View className="mb-4">
                    <Text
                        weight="medium"
                        className="mb-2 text-sm text-gray-700"
                    >
                        Harga per Bulan (Rp){" "}
                        <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        value={form.price}
                        onChangeText={(v) =>
                            setForm({
                                ...form,
                                price: v.replace(/[^0-9]/g, ""),
                            })
                        }
                        placeholder="Contoh: 1500000"
                        keyboardType="numeric"
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                        placeholderTextColor="#9CA3AF"
                        style={{ fontFamily: "Manrope_400Regular" }}
                    />
                </View>

                <View className="mb-4">
                    <Text
                        weight="medium"
                        className="mb-2 text-sm text-gray-700"
                    >
                        Alamat Lengkap <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        value={form.address}
                        onChangeText={(v) => setForm({ ...form, address: v })}
                        placeholder="Jl. Contoh No. 123, Kota"
                        multiline
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                        placeholderTextColor="#9CA3AF"
                        style={{ fontFamily: "Manrope_400Regular" }}
                    />
                </View>

                <View className="mb-4">
                    <Text
                        weight="medium"
                        className="mb-2 text-sm text-gray-700"
                    >
                        No. WhatsApp <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        value={form.whatsapp}
                        onChangeText={(v) => setForm({ ...form, whatsapp: v })}
                        placeholder="Contoh: 628123456789"
                        keyboardType="phone-pad"
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                        placeholderTextColor="#9CA3AF"
                        style={{ fontFamily: "Manrope_400Regular" }}
                    />
                </View>

                <View className="mb-6">
                    <View className="mb-2 flex-row items-center justify-between">
                        <Text weight="medium" className="text-sm text-gray-700">
                            Lokasi di Peta{" "}
                            <Text className="text-red-500">*</Text>
                        </Text>
                        <TouchableOpacity
                            onPress={getCurrentLocation}
                            className="flex-row items-center"
                        >
                            <Monicon
                                name="material-symbols:my-location-rounded"
                                size={18}
                                color="#1b988d"
                            />
                            <Text
                                weight="medium"
                                className="ml-1 text-sm text-primary"
                            >
                                Lokasi Saya
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="h-48 overflow-hidden rounded-xl border border-gray-200">
                        <LocationPickerMap
                            latitude={coordinate.latitude}
                            longitude={coordinate.longitude}
                            onLocationChange={handleLocationChange}
                        />
                    </View>
                    <Text className="mt-2 text-xs text-gray-400">
                        Tap pada peta atau geser pin untuk menentukan lokasi
                    </Text>
                </View>

                <View className="h-32" />
            </ScrollView>

            <View
                className="border-t border-gray-100 bg-white px-6 py-4"
                style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading}
                    className="items-center rounded-xl bg-primary py-4"
                >
                    {isLoading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text weight="semibold" className="text-lg text-white">
                            Daftarkan Kos
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

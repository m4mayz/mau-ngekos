import LeafletMap from "@/components/map/LeafletMap";
import Text from "@/components/ui/Text";
import {
    FirestoreBoardingHouse,
    FirestoreHouseImage,
    getBoardingHouse,
    getHouseImages,
} from "@/lib/firestore";
import { Monicon } from "@monicon/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function KosDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [house, setHouse] = useState<FirestoreBoardingHouse | null>(null);
    const [images, setImages] = useState<FirestoreHouseImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchHouseDetail();
    }, [id]);

    const fetchHouseDetail = async () => {
        if (!id) return;

        try {
            const houseData = await getBoardingHouse(id);
            if (houseData) setHouse(houseData);

            const imageData = await getHouseImages(id);
            setImages(imageData);
        } catch (error) {
            console.error("Error fetching house:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const openWhatsApp = () => {
        if (!house) return;
        const message = encodeURIComponent(
            `Halo, saya tertarik dengan kos "${house.name}" yang ada di MauNgekos. Apakah masih tersedia?`,
        );
        Linking.openURL(
            `https://wa.me/${house.whatsapp_number.replace(/[^0-9]/g, "")}?text=${message}`,
        );
    };

    const openMaps = () => {
        if (!house) return;
        Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${house.latitude},${house.longitude}`,
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#1b988d" />
            </View>
        );
    }

    if (!house) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-gray-500">Kos tidak ditemukan</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Header */}
                <View className="relative h-72 bg-gray-200">
                    {images.length > 0 ? (
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                        >
                            {images.map((img) => (
                                <Image
                                    key={img.id}
                                    source={{ uri: img.image_url }}
                                    className="h-72 w-screen"
                                    resizeMode="cover"
                                />
                            ))}
                        </ScrollView>
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Monicon
                                name="material-symbols:image-not-supported-rounded"
                                size={64}
                                color="#9CA3AF"
                            />
                            <Text className="mt-2 text-gray-400">
                                Tidak ada foto
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute left-4 h-10 w-10 items-center justify-center rounded-full bg-white/90"
                        style={{ top: insets.top + 8 }}
                    >
                        <Monicon
                            name="material-symbols:arrow-back-rounded"
                            size={24}
                            color="#374151"
                        />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="px-6 py-6">
                    <Text weight="bold" className="text-2xl text-gray-900">
                        {house.name}
                    </Text>

                    <View className="mt-2 flex-row items-center">
                        <Monicon
                            name="material-symbols:location-on-rounded"
                            size={20}
                            color="#6B7280"
                        />
                        <Text className="ml-2 flex-1 text-gray-500">
                            {house.address}
                        </Text>
                    </View>

                    <View className="mt-6 flex-row items-center rounded-2xl bg-primary/10 p-4">
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500">
                                Harga per Bulan
                            </Text>
                            <Text
                                weight="bold"
                                className="text-2xl text-primary"
                            >
                                {formatPrice(house.price_per_month)}
                            </Text>
                        </View>
                    </View>

                    {house.description && (
                        <View className="mt-6">
                            <Text
                                weight="semibold"
                                className="mb-2 text-lg text-gray-900"
                            >
                                Deskripsi
                            </Text>
                            <Text className="leading-6 text-gray-600">
                                {house.description}
                            </Text>
                        </View>
                    )}

                    {/* Location Section */}
                    <View className="mt-6">
                        <Text
                            weight="semibold"
                            className="mb-4 text-lg text-gray-900"
                        >
                            Lokasi
                        </Text>
                        <View className="h-40 overflow-hidden rounded-xl">
                            <LeafletMap
                                latitude={house.latitude}
                                longitude={house.longitude}
                                zoom={16}
                                markers={[
                                    {
                                        id: house.id,
                                        latitude: house.latitude,
                                        longitude: house.longitude,
                                        title: house.name,
                                    },
                                ]}
                                interactive={false}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={openMaps}
                            className="mt-3 flex-row items-center rounded-xl bg-gray-100 p-4"
                        >
                            <Monicon
                                name="material-symbols:directions-rounded"
                                size={24}
                                color="#1b988d"
                            />
                            <Text
                                weight="medium"
                                className="ml-3 flex-1 text-primary"
                            >
                                Buka di Google Maps
                            </Text>
                            <Monicon
                                name="material-symbols:chevron-right-rounded"
                                size={24}
                                color="#1b988d"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action */}
            <View
                className="border-t border-gray-100 bg-white px-6 py-4"
                style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
                <TouchableOpacity
                    onPress={openWhatsApp}
                    className="flex-row items-center justify-center rounded-xl bg-green-500 py-4"
                >
                    <Monicon name="mdi:whatsapp" size={24} color="#ffffff" />
                    <Text weight="semibold" className="ml-3 text-lg text-white">
                        Hubungi via WhatsApp
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

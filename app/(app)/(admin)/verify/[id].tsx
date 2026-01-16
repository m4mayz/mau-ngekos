import LeafletMap from "@/components/map/LeafletMap";
import Text from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { BoardingHouse, HouseImage, User } from "@/types/database";
import { Monicon } from "@monicon/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

export default function VerifyKosScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [house, setHouse] = useState<BoardingHouse | null>(null);
    const [owner, setOwner] = useState<User | null>(null);
    const [images, setImages] = useState<HouseImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;

        const { data: houseData } = await supabase
            .from("boarding_houses")
            .select("*")
            .eq("id", id)
            .single();

        if (houseData) {
            setHouse(houseData);

            const { data: ownerData } = await supabase
                .from("users")
                .select("*")
                .eq("id", houseData.owner_id)
                .single();

            if (ownerData) setOwner(ownerData);
        }

        const { data: imageData } = await supabase
            .from("house_images")
            .select("*")
            .eq("house_id", id);

        if (imageData) setImages(imageData);
        setIsLoading(false);
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleApprove = async () => {
        Alert.alert(
            "Konfirmasi",
            "Apakah Anda yakin ingin menyetujui kos ini?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Setujui",
                    onPress: async () => {
                        setIsUpdating(true);
                        const { error } = await supabase
                            .from("boarding_houses")
                            .update({ status: "approved" })
                            .eq("id", id);

                        if (!error) {
                            Alert.alert("Sukses", "Kos berhasil disetujui", [
                                { text: "OK", onPress: () => router.back() },
                            ]);
                        } else {
                            Alert.alert("Error", "Gagal menyetujui kos");
                        }
                        setIsUpdating(false);
                    },
                },
            ]
        );
    };

    const handleReject = async () => {
        Alert.alert("Konfirmasi", "Apakah Anda yakin ingin menolak kos ini?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Tolak",
                style: "destructive",
                onPress: async () => {
                    setIsUpdating(true);
                    const { error } = await supabase
                        .from("boarding_houses")
                        .update({ status: "rejected" })
                        .eq("id", id);

                    if (!error) {
                        Alert.alert("Sukses", "Kos berhasil ditolak", [
                            { text: "OK", onPress: () => router.back() },
                        ]);
                    } else {
                        Alert.alert("Error", "Gagal menolak kos");
                    }
                    setIsUpdating(false);
                },
            },
        ]);
    };

    const openWhatsApp = (phone: string) => {
        Linking.openURL(`https://wa.me/${phone.replace(/[^0-9]/g, "")}`);
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    if (!house) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-gray-500">Data tidak ditemukan</Text>
            </View>
        );
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-700",
                label: "Pending",
            },
            approved: {
                bg: "bg-green-100",
                text: "text-green-700",
                label: "Approved",
            },
            rejected: {
                bg: "bg-red-100",
                text: "text-red-700",
                label: "Rejected",
            },
        };
        return styles[status as keyof typeof styles];
    };

    const badge = getStatusBadge(house.status);

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center border-b border-gray-100 px-4 pb-4 pt-14">
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
                <Text weight="bold" className="flex-1 text-xl text-gray-900">
                    Verifikasi Kos
                </Text>
                <View className={`rounded-full px-3 py-1 ${badge.bg}`}>
                    <Text weight="medium" className={`text-xs ${badge.text}`}>
                        {badge.label}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {images.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="px-4 pt-4"
                    >
                        {images.map((img) => (
                            <Image
                                key={img.id}
                                source={{ uri: img.image_url }}
                                className="mr-2 h-40 w-56 rounded-xl"
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                )}

                <View className="px-6 py-4">
                    <Text weight="bold" className="text-2xl text-gray-900">
                        {house.name}
                    </Text>
                    <View className="mt-2 flex-row items-center">
                        <Monicon
                            name="material-symbols:location-on-rounded"
                            size={18}
                            color="#6B7280"
                        />
                        <Text className="ml-2 flex-1 text-gray-500">
                            {house.address}
                        </Text>
                    </View>

                    <View className="my-4 rounded-2xl bg-primary/10 p-4">
                        <Text className="text-sm text-gray-500">
                            Harga per Bulan
                        </Text>
                        <Text weight="bold" className="text-2xl text-primary">
                            {formatPrice(house.price_per_month)}
                        </Text>
                    </View>

                    {house.description && (
                        <View className="mb-4">
                            <Text
                                weight="semibold"
                                className="mb-2 text-gray-900"
                            >
                                Deskripsi
                            </Text>
                            <Text className="text-gray-600">
                                {house.description}
                            </Text>
                        </View>
                    )}

                    {owner && (
                        <View className="mb-4 rounded-xl bg-gray-50 p-4">
                            <Text
                                weight="semibold"
                                className="mb-2 text-gray-900"
                            >
                                Pemilik
                            </Text>
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-gray-700">
                                        {owner.full_name}
                                    </Text>
                                    <Text className="text-sm text-gray-500">
                                        {owner.email}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() =>
                                        openWhatsApp(house.whatsapp_number)
                                    }
                                    className="rounded-lg bg-green-500 p-2"
                                >
                                    <Monicon
                                        name="mdi:whatsapp"
                                        size={24}
                                        color="#ffffff"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View className="mb-4">
                        <Text weight="semibold" className="mb-2 text-gray-900">
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
                    </View>

                    <View className="mb-4 flex-row items-center">
                        <Monicon
                            name="mdi:whatsapp"
                            size={20}
                            color="#25D366"
                        />
                        <Text className="ml-2 text-gray-700">
                            {house.whatsapp_number}
                        </Text>
                    </View>

                    <Text className="text-sm text-gray-400">
                        Didaftarkan:{" "}
                        {new Date(house.created_at).toLocaleDateString("id-ID")}
                    </Text>
                </View>
                <View className="h-32" />
            </ScrollView>

            {house.status === "pending" && (
                <View className="flex-row gap-4 border-t border-gray-100 bg-white px-6 py-4">
                    <TouchableOpacity
                        onPress={handleReject}
                        disabled={isUpdating}
                        className="flex-1 flex-row items-center justify-center rounded-xl border border-red-500 py-4"
                    >
                        <Monicon
                            name="material-symbols:close-rounded"
                            size={20}
                            color="#EF4444"
                        />
                        <Text weight="semibold" className="ml-2 text-red-500">
                            Tolak
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleApprove}
                        disabled={isUpdating}
                        className="flex-1 flex-row items-center justify-center rounded-xl bg-green-500 py-4"
                    >
                        {isUpdating ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <>
                                <Monicon
                                    name="material-symbols:check-rounded"
                                    size={20}
                                    color="#ffffff"
                                />
                                <Text
                                    weight="semibold"
                                    className="ml-2 text-white"
                                >
                                    Setujui
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

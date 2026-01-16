import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { BoardingHouse } from "@/types/database";
import { Monicon } from "@monicon/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

export default function OwnerDashboardScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [houses, setHouses] = useState<BoardingHouse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (user) fetchMyHouses();
    }, [user]);

    const fetchMyHouses = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from("boarding_houses")
            .select("*")
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false });

        if (data && !error) setHouses(data);
        setIsLoading(false);
        setIsRefreshing(false);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-700",
                label: "Menunggu",
            },
            approved: {
                bg: "bg-green-100",
                text: "text-green-700",
                label: "Disetujui",
            },
            rejected: {
                bg: "bg-red-100",
                text: "text-red-700",
                label: "Ditolak",
            },
        };
        return styles[status as keyof typeof styles];
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-primary px-6 pb-6 pt-14">
                <Text weight="bold" className="text-2xl text-white">
                    Kos Saya
                </Text>
                <Text className="mt-1 text-white/80">
                    {houses.length} kos terdaftar
                </Text>
            </View>

            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            setIsRefreshing(true);
                            fetchMyHouses();
                        }}
                    />
                }
            >
                {houses.length === 0 ? (
                    <View className="mt-20 items-center px-6">
                        <Monicon
                            name="material-symbols:home-off-rounded"
                            size={64}
                            color="#9CA3AF"
                        />
                        <Text
                            weight="medium"
                            className="mt-4 text-center text-lg text-gray-500"
                        >
                            Kamu belum punya kos terdaftar
                        </Text>
                        <Text className="mt-2 text-center text-gray-400">
                            Mulai pasang iklan kos pertamamu!
                        </Text>
                    </View>
                ) : (
                    houses.map((house) => {
                        const badge = getStatusBadge(house.status);
                        return (
                            <View
                                key={house.id}
                                className="mb-4 rounded-2xl bg-white p-4 shadow"
                            >
                                <View className="flex-row items-start justify-between">
                                    <View className="flex-1">
                                        <Text
                                            weight="semibold"
                                            className="text-lg text-gray-900"
                                        >
                                            {house.name}
                                        </Text>
                                        <Text
                                            className="mt-1 text-sm text-gray-500"
                                            numberOfLines={2}
                                        >
                                            {house.address}
                                        </Text>
                                    </View>
                                    <View
                                        className={`rounded-full px-3 py-1 ${badge.bg}`}
                                    >
                                        <Text
                                            weight="medium"
                                            className={`text-xs ${badge.text}`}
                                        >
                                            {badge.label}
                                        </Text>
                                    </View>
                                </View>
                                <View className="mt-3 flex-row items-center justify-between">
                                    <Text
                                        weight="bold"
                                        className="text-lg text-primary"
                                    >
                                        {formatPrice(house.price_per_month)}
                                        <Text className="text-sm text-gray-500">
                                            /bln
                                        </Text>
                                    </Text>
                                    <Text className="text-sm text-gray-400">
                                        {new Date(
                                            house.created_at
                                        ).toLocaleDateString("id-ID")}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}
                <View className="h-24" />
            </ScrollView>

            {/* FAB Add */}
            <TouchableOpacity
                onPress={() => router.push("/(app)/(owner)/add-listing")}
                className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
            >
                <Monicon
                    name="material-symbols:add-rounded"
                    size={28}
                    color="#ffffff"
                />
            </TouchableOpacity>
        </View>
    );
}

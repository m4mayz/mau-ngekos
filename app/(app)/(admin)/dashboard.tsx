import Text from "@/components/ui/Text";
import {
    FirestoreBoardingHouse,
    getAllBoardingHouses,
    getBoardingHousesByStatus,
} from "@/lib/firestore";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminDashboardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [pendingHouses, setPendingHouses] = useState<
        FirestoreBoardingHouse[]
    >([]);
    const [allHouses, setAllHouses] = useState<FirestoreBoardingHouse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

    useEffect(() => {
        fetchHouses();
    }, []);

    const fetchHouses = async () => {
        try {
            const pending = await getBoardingHousesByStatus("pending");
            const all = await getAllBoardingHouses();

            setPendingHouses(pending);
            setAllHouses(all);
        } catch (error) {
            console.error("Error fetching houses:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
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

    const displayedHouses = activeTab === "pending" ? pendingHouses : allHouses;

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#1b988d" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <View
                className="bg-primary px-6 pb-6"
                style={{ paddingTop: insets.top + 16 }}
            >
                <Text weight="bold" className="text-2xl text-white">
                    Admin Dashboard
                </Text>
                <Text className="mt-1 text-white/80">
                    {pendingHouses.length} kos menunggu verifikasi
                </Text>
            </View>

            {/* Tabs */}
            <View className="flex-row bg-white px-4 py-2 shadow-sm">
                <TouchableOpacity
                    onPress={() => setActiveTab("pending")}
                    className={`mr-2 flex-1 items-center rounded-lg py-3 ${activeTab === "pending" ? "bg-primary" : "bg-gray-100"}`}
                >
                    <Text
                        weight="medium"
                        className={
                            activeTab === "pending"
                                ? "text-white"
                                : "text-gray-600"
                        }
                    >
                        Pending ({pendingHouses.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab("all")}
                    className={`ml-2 flex-1 items-center rounded-lg py-3 ${activeTab === "all" ? "bg-primary" : "bg-gray-100"}`}
                >
                    <Text
                        weight="medium"
                        className={
                            activeTab === "all" ? "text-white" : "text-gray-600"
                        }
                    >
                        Semua ({allHouses.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            setIsRefreshing(true);
                            fetchHouses();
                        }}
                    />
                }
            >
                {displayedHouses.length === 0 ? (
                    <View className="mt-20 items-center px-6">
                        <Monicon
                            name="material-symbols:check-circle-rounded"
                            size={64}
                            color="#10B981"
                        />
                        <Text
                            weight="medium"
                            className="mt-4 text-center text-lg text-gray-500"
                        >
                            {activeTab === "pending"
                                ? "Tidak ada kos yang menunggu verifikasi"
                                : "Belum ada kos terdaftar"}
                        </Text>
                    </View>
                ) : (
                    displayedHouses.map((house) => {
                        const badge = getStatusBadge(house.status);
                        return (
                            <TouchableOpacity
                                key={house.id}
                                onPress={() =>
                                    router.push(
                                        `/(app)/(admin)/verify/${house.id}`,
                                    )
                                }
                                className="mb-4 rounded-2xl bg-white p-4 shadow"
                            >
                                <View className="flex-row items-start justify-between">
                                    <View className="flex-1 pr-2">
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
                                    <View className="flex-row items-center">
                                        <Monicon
                                            name="material-symbols:visibility-rounded"
                                            size={18}
                                            color="#1b988d"
                                        />
                                        <Text
                                            weight="medium"
                                            className="ml-1 text-sm text-primary"
                                        >
                                            Review
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
                <View className="h-24" />
            </ScrollView>
        </View>
    );
}

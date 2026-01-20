import EmptyState from "@/components/ui/EmptyState";
import KosCard from "@/components/ui/KosCard";
import PageHeader from "@/components/ui/PageHeader";
import Text from "@/components/ui/Text";
import {
    FirestoreBoardingHouse,
    getAllBoardingHouses,
    getBoardingHousesByStatus,
} from "@/lib/firestore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminDashboardScreen() {
    const router = useRouter();
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
            <PageHeader
                title="Admin Dashboard"
                subtitle={`${pendingHouses.length} kos menunggu verifikasi`}
            />

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
                    <EmptyState
                        icon="material-symbols:check-circle-rounded"
                        title={
                            activeTab === "pending"
                                ? "Tidak ada kos yang menunggu verifikasi"
                                : "Belum ada kos terdaftar"
                        }
                    />
                ) : (
                    displayedHouses.map((house) => (
                        <KosCard
                            key={house.id}
                            id={house.id}
                            name={house.name}
                            address={house.address}
                            price={house.price_per_month}
                            status={
                                house.status as
                                    | "pending"
                                    | "approved"
                                    | "rejected"
                            }
                            onPress={() =>
                                router.push(`/(app)/(admin)/verify/${house.id}`)
                            }
                        />
                    ))
                )}
                <View className="h-24" />
            </ScrollView>
        </View>
    );
}

import EmptyState from "@/components/ui/EmptyState";
import FAB from "@/components/ui/FAB";
import KosCard from "@/components/ui/KosCard";
import PageHeader from "@/components/ui/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import {
    FirestoreBoardingHouse,
    getBoardingHousesByOwner,
} from "@/lib/firestore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    View,
} from "react-native";

export default function OwnerDashboardScreen() {
    const router = useRouter();
    const { firebaseUser } = useAuth();
    const [houses, setHouses] = useState<FirestoreBoardingHouse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (firebaseUser) fetchMyHouses();
    }, [firebaseUser]);

    const fetchMyHouses = async () => {
        if (!firebaseUser) return;

        try {
            const data = await getBoardingHousesByOwner(firebaseUser.uid);
            setHouses(data);
        } catch (error) {
            console.error("Error fetching houses:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

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
                title="Kos Saya"
                subtitle={`${houses.length} kos terdaftar`}
            />

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
                    <EmptyState
                        icon="material-symbols:home-off-rounded"
                        title="Kamu belum punya kos terdaftar"
                        description="Mulai pasang iklan kos pertamamu!"
                    />
                ) : (
                    houses.map((house) => (
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
                            date={house.created_at
                                .toDate()
                                .toLocaleDateString("id-ID")}
                        />
                    ))
                )}
                <View className="h-24" />
            </ScrollView>

            <FAB
                icon="material-symbols:add-rounded"
                onPress={() => router.push("/(app)/(owner)/add-listing")}
            />
        </View>
    );
}

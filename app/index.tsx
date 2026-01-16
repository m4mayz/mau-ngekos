import { useAuth } from "@/contexts/AuthContext";
import { Monicon } from "@monicon/native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SplashScreen() {
    const { isLoading, isAuthenticated, role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Delay for splash effect
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                // Not logged in - show public map
                router.replace("/(public)/map");
            } else {
                // Logged in - navigate based on role
                if (role === "admin") {
                    router.replace("/(app)/(admin)/dashboard");
                } else if (role === "owner") {
                    router.replace("/(app)/(owner)/dashboard");
                } else {
                    router.replace("/(app)/(seeker)/home");
                }
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [isLoading, isAuthenticated, role]);

    return (
        <View className="flex-1 items-center justify-center bg-primary">
            <View className="items-center">
                <Monicon
                    name="material-symbols:location-home-rounded"
                    size={80}
                    color="#ffffff"
                />
                <Text
                    className="mt-4 text-3xl text-white"
                    style={{ fontFamily: "Manrope_700Bold" }}
                >
                    MauNgekos
                </Text>
                <Text
                    className="mt-2 text-white/80"
                    style={{ fontFamily: "Manrope_400Regular" }}
                >
                    Cari Kos Impianmu
                </Text>
            </View>
            <ActivityIndicator
                size="large"
                color="#ffffff"
                className="absolute bottom-20"
            />
        </View>
    );
}

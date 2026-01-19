import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SplashScreen() {
    const { isLoading, isAuthenticated, role } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isLoading) return;

        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.replace("/(public)/map");
            } else {
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
        <View
            className="flex-1 items-center justify-center bg-primary"
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
            <View className="items-center">
                <Image
                    source={require("@/assets/images/icon.png")}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                />
                <Text
                    weight="bold"
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

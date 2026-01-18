import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { Monicon } from "@monicon/native";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyKosScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuth();

    // If user is owner, redirect to owner dashboard
    if (user?.role === "owner" || user?.role === "admin") {
        return (
            <View className="flex-1 bg-gray-50">
                <View
                    className="bg-primary px-6 pb-6"
                    style={{ paddingTop: insets.top + 16 }}
                >
                    <Text weight="bold" className="text-2xl text-white">
                        Kos Saya
                    </Text>
                    <Text className="mt-1 text-white/80">
                        Kelola kos-kosanmu
                    </Text>
                </View>

                <View className="flex-1 items-center justify-center px-6">
                    <Monicon
                        name="material-symbols:home-rounded"
                        size={64}
                        color="#1b988d"
                    />
                    <Text
                        weight="semibold"
                        className="mt-4 text-lg text-gray-700 text-center"
                    >
                        Kamu sudah terdaftar sebagai pemilik kos
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(app)/(owner)/dashboard")}
                        className="mt-6 bg-primary px-6 py-3 rounded-xl"
                    >
                        <Text weight="semibold" className="text-white">
                            Buka Dashboard Owner
                        </Text>
                    </TouchableOpacity>
                </View>
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
                    Kos Saya
                </Text>
                <Text className="mt-1 text-white/80">Detail penyewaan</Text>
            </View>

            <View className="flex-1 items-center justify-center px-6">
                <Monicon
                    name="material-symbols:home-rounded"
                    size={64}
                    color="#D1D5DB"
                />
                <Text
                    weight="semibold"
                    className="mt-4 text-lg text-gray-500 text-center"
                >
                    Kamu belum menyewa kos
                </Text>
                <Text className="mt-2 text-gray-400 text-center">
                    Cari dan hubungi pemilik kos untuk mulai menyewa
                </Text>
            </View>
        </View>
    );
}

import MenuItem from "@/components/ui/MenuItem";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { updateUser } from "@/lib/firestore";
import { Monicon } from "@monicon/native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, firebaseUser, refreshUser } = useAuth();

    const handleLogout = async () => {
        Alert.alert("Keluar", "Apakah kamu yakin ingin keluar?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Keluar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut(auth);
                        router.replace("/(auth)/login");
                    } catch (error) {
                        console.error("Logout error:", error);
                        Alert.alert("Error", "Gagal keluar. Coba lagi.");
                    }
                },
            },
        ]);
    };

    const handleBecomeOwner = async () => {
        if (!firebaseUser) return;

        Alert.alert(
            "Jadi Pemilik Kos",
            "Apakah kamu ingin menjadi pemilik kos dan memasang iklan?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Ya, Lanjutkan",
                    onPress: async () => {
                        try {
                            await updateUser(firebaseUser.uid, {
                                role: "owner",
                            });
                            await refreshUser();
                            Alert.alert(
                                "Sukses",
                                "Role berhasil diubah menjadi Owner!",
                            );
                        } catch (error) {
                            Alert.alert("Error", "Gagal mengubah role");
                        }
                    },
                },
            ],
        );
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <PageHeader title="Profil" />

            {/* Profile Card */}
            <View className="-mt-4 mx-4 rounded-2xl bg-white p-6 shadow-lg">
                <View className="items-center">
                    <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Monicon
                            name="material-symbols:person-rounded"
                            size={48}
                            color="#1b988d"
                        />
                    </View>
                    <Text weight="bold" className="mt-4 text-xl text-gray-900">
                        {user?.full_name || firebaseUser?.displayName || "User"}
                    </Text>
                    <Text className="text-gray-500">
                        {user?.email || firebaseUser?.email}
                    </Text>
                    {user && (
                        <View className="mt-2">
                            <StatusBadge
                                type={user.role as "seeker" | "owner" | "admin"}
                            />
                        </View>
                    )}
                </View>
            </View>

            {/* Menu Items */}
            <View
                className="mx-4 mt-6 rounded-2xl bg-white shadow"
                style={{ marginBottom: insets.bottom + 100 }}
            >
                {user?.phone_number && (
                    <MenuItem
                        icon="material-symbols:phone-rounded"
                        title="No. Telepon"
                        subtitle={user.phone_number}
                        showChevron={false}
                    />
                )}

                {user?.role === "seeker" && (
                    <MenuItem
                        icon="material-symbols:add-home-rounded"
                        iconColor="#10B981"
                        title="Mau Pasang Iklan Kos?"
                        onPress={handleBecomeOwner}
                    />
                )}

                <MenuItem
                    icon="material-symbols:logout-rounded"
                    title="Keluar"
                    onPress={handleLogout}
                    variant="danger"
                    showChevron={false}
                    hasBorder={false}
                />
            </View>
        </ScrollView>
    );
}

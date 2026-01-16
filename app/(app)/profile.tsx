import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";
import { Monicon } from "@monicon/native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
    const router = useRouter();
    const { user, firebaseUser, refreshUser } = useAuth();

    const handleLogout = async () => {
        Alert.alert("Keluar", "Apakah kamu yakin ingin keluar?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Keluar",
                style: "destructive",
                onPress: async () => {
                    await signOut(auth);
                    router.replace("/");
                },
            },
        ]);
    };

    const handleBecomeOwner = async () => {
        if (!user) return;

        Alert.alert(
            "Jadi Penyewa Kos",
            "Apakah kamu ingin menjadi penyewa kos dan memasang iklan?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Ya, Lanjutkan",
                    onPress: async () => {
                        const { error } = await supabase
                            .from("users")
                            .update({ role: "owner" })
                            .eq("id", user.id);

                        if (!error) {
                            await refreshUser();
                            Alert.alert(
                                "Sukses",
                                "Role berhasil diubah menjadi Owner!"
                            );
                        }
                    },
                },
            ]
        );
    };

    const getRoleBadge = (role: string) => {
        const colors = {
            seeker: "bg-blue-100 text-blue-700",
            owner: "bg-green-100 text-green-700",
            admin: "bg-purple-100 text-purple-700",
        };
        const labels = {
            seeker: "Pencari Kos",
            owner: "Pemilik Kos",
            admin: "Admin",
        };
        return {
            color: colors[role as keyof typeof colors],
            label: labels[role as keyof typeof labels],
        };
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="bg-primary px-6 pb-8 pt-16">
                <Text weight="bold" className="text-2xl text-white">
                    Profil
                </Text>
            </View>

            {/* Profile Card */}
            <View className="-mt-4 mx-4 rounded-2xl bg-white p-6 shadow-lg">
                <View className="items-center">
                    <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Monicon
                            name="material-symbols:person-rounded"
                            size={48}
                            color="#6366F1"
                        />
                    </View>
                    <Text weight="bold" className="mt-4 text-xl text-gray-900">
                        {user?.full_name || firebaseUser?.displayName || "User"}
                    </Text>
                    <Text className="text-gray-500">
                        {user?.email || firebaseUser?.email}
                    </Text>
                    {user && (
                        <View
                            className={`mt-2 rounded-full px-3 py-1 ${getRoleBadge(user.role).color}`}
                        >
                            <Text weight="medium">
                                {getRoleBadge(user.role).label}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Menu Items */}
            <View className="mx-4 mt-6 rounded-2xl bg-white shadow">
                {user?.phone_number && (
                    <View className="flex-row items-center border-b border-gray-100 px-4 py-4">
                        <Monicon
                            name="material-symbols:phone-rounded"
                            size={24}
                            color="#6B7280"
                        />
                        <View className="ml-4 flex-1">
                            <Text className="text-sm text-gray-500">
                                No. Telepon
                            </Text>
                            <Text weight="medium" className="text-gray-900">
                                {user.phone_number}
                            </Text>
                        </View>
                    </View>
                )}

                {user?.role === "seeker" && (
                    <TouchableOpacity
                        onPress={handleBecomeOwner}
                        className="flex-row items-center border-b border-gray-100 px-4 py-4"
                    >
                        <Monicon
                            name="material-symbols:add-home-rounded"
                            size={24}
                            color="#10B981"
                        />
                        <Text
                            weight="medium"
                            className="ml-4 flex-1 text-gray-900"
                        >
                            Mau Pasang Iklan Kos?
                        </Text>
                        <Monicon
                            name="material-symbols:chevron-right-rounded"
                            size={24}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center px-4 py-4"
                >
                    <Monicon
                        name="material-symbols:logout-rounded"
                        size={24}
                        color="#EF4444"
                    />
                    <Text weight="medium" className="ml-4 flex-1 text-red-500">
                        Keluar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

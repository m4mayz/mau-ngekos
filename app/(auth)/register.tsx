import Text from "@/components/ui/Text";
import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";
import { Monicon } from "@monicon/native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function RegisterScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            Alert.alert("Error", "Mohon lengkapi semua data");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password minimal 6 karakter");
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(userCredential.user, { displayName: fullName });

            const { error: supabaseError } = await supabase
                .from("users")
                .insert({
                    firebase_uid: userCredential.user.uid,
                    email: email,
                    full_name: fullName,
                    phone_number: phone || null,
                    role: "seeker",
                });

            if (supabaseError) console.error("Supabase error:", supabaseError);

            Alert.alert("Sukses", "Akun berhasil dibuat!", [
                { text: "OK", onPress: () => router.replace("/") },
            ]);
        } catch (error: any) {
            let message = "Registrasi gagal";
            if (error.code === "auth/email-already-in-use") {
                message = "Email sudah digunakan";
            } else if (error.code === "auth/weak-password") {
                message = "Password terlalu lemah";
            } else if (error.code === "auth/invalid-email") {
                message = "Format email tidak valid";
            }
            Alert.alert("Error", message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-6 pt-16">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mb-8 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                    >
                        <Monicon
                            name="material-symbols:arrow-back-rounded"
                            size={24}
                            color="#374151"
                        />
                    </TouchableOpacity>

                    <View className="mb-8">
                        <Text weight="bold" className="text-3xl text-gray-900">
                            Buat Akun Baru 🏠
                        </Text>
                        <Text className="mt-2 text-gray-500">
                            Daftar untuk mulai mencari kos impianmu
                        </Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text
                                weight="medium"
                                className="mb-2 text-sm text-gray-700"
                            >
                                Nama Lengkap
                            </Text>
                            <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
                                <Monicon
                                    name="material-symbols:person-rounded"
                                    size={20}
                                    color="#6B7280"
                                />
                                <TextInput
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="John Doe"
                                    className="ml-3 flex-1 py-4 text-gray-900"
                                    placeholderTextColor="#9CA3AF"
                                    style={{ fontFamily: "Manrope_400Regular" }}
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text
                                weight="medium"
                                className="mb-2 text-sm text-gray-700"
                            >
                                Email
                            </Text>
                            <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
                                <Monicon
                                    name="material-symbols:mail-rounded"
                                    size={20}
                                    color="#6B7280"
                                />
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="nama@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="ml-3 flex-1 py-4 text-gray-900"
                                    placeholderTextColor="#9CA3AF"
                                    style={{ fontFamily: "Manrope_400Regular" }}
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text
                                weight="medium"
                                className="mb-2 text-sm text-gray-700"
                            >
                                No. WhatsApp (Opsional)
                            </Text>
                            <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
                                <Monicon
                                    name="mdi:whatsapp"
                                    size={20}
                                    color="#6B7280"
                                />
                                <TextInput
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="08123456789"
                                    keyboardType="phone-pad"
                                    className="ml-3 flex-1 py-4 text-gray-900"
                                    placeholderTextColor="#9CA3AF"
                                    style={{ fontFamily: "Manrope_400Regular" }}
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text
                                weight="medium"
                                className="mb-2 text-sm text-gray-700"
                            >
                                Password
                            </Text>
                            <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
                                <Monicon
                                    name="material-symbols:lock-rounded"
                                    size={20}
                                    color="#6B7280"
                                />
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Minimal 6 karakter"
                                    secureTextEntry={!showPassword}
                                    className="ml-3 flex-1 py-4 text-gray-900"
                                    placeholderTextColor="#9CA3AF"
                                    style={{ fontFamily: "Manrope_400Regular" }}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <Monicon
                                        name={
                                            showPassword
                                                ? "material-symbols:visibility-off-rounded"
                                                : "material-symbols:visibility-rounded"
                                        }
                                        size={20}
                                        color="#6B7280"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={isLoading}
                            className="mt-6 items-center rounded-xl bg-primary py-4"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text
                                    weight="semibold"
                                    className="text-lg text-white"
                                >
                                    Daftar
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View className="my-6 flex-row items-center">
                            <View className="h-px flex-1 bg-gray-200" />
                            <Text className="mx-4 text-gray-400">atau</Text>
                            <View className="h-px flex-1 bg-gray-200" />
                        </View>

                        <TouchableOpacity className="flex-row items-center justify-center rounded-xl border border-gray-200 py-4">
                            <Monicon
                                name="mdi:google"
                                size={24}
                                color="#EA4335"
                            />
                            <Text
                                weight="medium"
                                className="ml-3 text-gray-700"
                            >
                                Daftar dengan Google
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-auto flex-row justify-center pb-8 pt-6">
                        <Text className="text-gray-500">
                            Sudah punya akun?{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/login")}
                        >
                            <Text weight="semibold" className="text-primary">
                                Masuk
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

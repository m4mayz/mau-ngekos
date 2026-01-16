import Text from "@/components/ui/Text";
import { auth } from "@/lib/firebase";
import { Monicon } from "@monicon/native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Mohon isi email dan password");
            return;
        }

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/");
        } catch (error: any) {
            let message = "Login gagal";
            if (error.code === "auth/invalid-credential") {
                message = "Email atau password salah";
            } else if (error.code === "auth/user-not-found") {
                message = "Akun tidak ditemukan";
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
                    {/* Back Button */}
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

                    {/* Header */}
                    <View className="mb-8">
                        <Text weight="bold" className="text-3xl text-gray-900">
                            Selamat Datang! 👋
                        </Text>
                        <Text className="mt-2 text-gray-500">
                            Masuk ke akun MauNgekos kamu
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        {/* Email Input */}
                        <View>
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

                        {/* Password Input */}
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
                                    placeholder="********"
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

                        {/* Forgot Password */}
                        <TouchableOpacity className="mt-2 self-end">
                            <Text
                                weight="medium"
                                className="text-sm text-primary"
                            >
                                Lupa Password?
                            </Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
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
                                    Masuk
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="my-6 flex-row items-center">
                            <View className="h-px flex-1 bg-gray-200" />
                            <Text className="mx-4 text-gray-400">atau</Text>
                            <View className="h-px flex-1 bg-gray-200" />
                        </View>

                        {/* Google Login */}
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
                                Lanjutkan dengan Google
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Register Link */}
                    <View className="mt-auto flex-row justify-center pb-8 pt-6">
                        <Text className="text-gray-500">
                            Belum punya akun?{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/register")}
                        >
                            <Text weight="semibold" className="text-primary">
                                Daftar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

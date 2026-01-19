import Text from "@/components/ui/Text";
import { auth } from "@/lib/firebase";
import { Monicon } from "@monicon/native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
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
                showsVerticalScrollIndicator={false}
            >
                {/* Header Image Section */}
                <View
                    className="h-72 bg-primary/10 items-center justify-end pb-6"
                    style={{
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40,
                    }}
                >
                    {/* Decorative Pattern */}
                    <View
                        className="absolute inset-0 overflow-hidden"
                        style={{
                            borderBottomLeftRadius: 40,
                            borderBottomRightRadius: 40,
                        }}
                    >
                        <View className="absolute inset-0 opacity-30">
                            {/* Grid pattern effect */}
                            {[...Array(8)].map((_, i) => (
                                <View
                                    key={i}
                                    className="flex-row justify-around mt-6"
                                >
                                    {[...Array(6)].map((_, j) => (
                                        <View
                                            key={j}
                                            className="w-2 h-2 rounded-full bg-primary"
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Logo Badge */}
                    <View className="bg-white/90 px-4 py-2 rounded-full shadow-sm">
                        <Image
                            source={require("@/assets/images/horizontal.png")}
                            style={{ width: 120, height: 30 }}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Main Content */}
                <View className="flex-1 px-6 -mt-4">
                    {/* Headline */}
                    <View className="items-center mt-10 mb-8">
                        <Text
                            weight="extrabold"
                            className="text-2xl text-gray-900 text-center"
                        >
                            Selamat Datang
                        </Text>
                        <Text className="mt-2 text-gray-500 text-center">
                            Masuk dulu terus lanjut cari kos-kosan di sekitarmu!
                        </Text>
                    </View>

                    {/* Form */}
                    <View>
                        {/* Email Field */}
                        <View className="mb-5">
                            <Text
                                weight="bold"
                                className="text-xs uppercase tracking-wider text-gray-500 mb-2 ml-1"
                            >
                                Email Address
                            </Text>
                            <View className="flex-row items-center rounded-full bg-gray-50 border border-transparent">
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="nama@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="flex-1 h-12 px-4 text-gray-900"
                                    placeholderTextColor="#9aacac"
                                    style={{ fontFamily: "Manrope_400Regular" }}
                                />
                                <View className="pr-4">
                                    <Monicon
                                        name="material-symbols:mail-rounded"
                                        size={22}
                                        color="#658683"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Password Field */}
                        <View className="mb-4">
                            <Text
                                weight="bold"
                                className="text-xs uppercase tracking-wider text-gray-500 mb-2 ml-1"
                            >
                                Password
                            </Text>
                            <View className="flex-row items-center rounded-full bg-gray-50 border border-transparent">
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    secureTextEntry={!showPassword}
                                    className="flex-1 h-12 px-4 text-gray-900"
                                    placeholderTextColor="#9aacac"
                                    style={{ fontFamily: "Manrope_400Regular" }}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="pr-4"
                                >
                                    <Monicon
                                        name={
                                            showPassword
                                                ? "material-symbols:visibility-rounded"
                                                : "material-symbols:visibility-off-rounded"
                                        }
                                        size={22}
                                        color="#658683"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity className="self-end mb-4">
                            <Text
                                weight="semibold"
                                className="text-sm text-primary"
                            >
                                Lupa Password?
                            </Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading}
                            className="flex-row items-center justify-center rounded-full bg-primary h-14 mt-2"
                            style={{
                                shadowColor: "#1b988d",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                            }}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <>
                                    <Text
                                        weight="bold"
                                        className="text-white text-base"
                                    >
                                        Masuk Sekarang
                                    </Text>
                                    <View className="ml-2">
                                        <Monicon
                                            name="material-symbols:arrow-forward-rounded"
                                            size={20}
                                            color="#ffffff"
                                        />
                                    </View>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-px bg-gray-200" />
                        <Text className="mx-4 text-xs text-gray-400">
                            Atau kamu juga bisa masuk dengan
                        </Text>
                        <View className="flex-1 h-px bg-gray-200" />
                    </View>

                    {/* Google Login */}
                    <TouchableOpacity className="flex-row items-center justify-center rounded-full border border-gray-200 bg-white h-14 shadow-sm">
                        <Monicon name="logos:google-icon" size={20} />
                        <Text
                            weight="bold"
                            className="ml-3 text-base text-gray-900"
                        >
                            Google
                        </Text>
                    </TouchableOpacity>

                    {/* Register Link */}
                    <View
                        className="flex-row justify-center pt-6"
                        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
                    >
                        <Text className="text-sm text-gray-500">
                            Belum punya akun?
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/register")}
                        >
                            <Text
                                weight="bold"
                                className="text-sm text-primary ml-1"
                            >
                                Gas Daftar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

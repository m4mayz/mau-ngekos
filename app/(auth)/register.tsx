import Text from "@/components/ui/Text";
import { auth } from "@/lib/firebase";
import { createUser } from "@/lib/firestore";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            Alert.alert("Error", "Mohon lengkapi semua data");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password minimal 6 karakter");
            return;
        }

        if (!agreedToTerms) {
            Alert.alert(
                "Error",
                "Kamu harus menyetujui Syarat & Ketentuan untuk melanjutkan",
            );
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            await updateProfile(userCredential.user, { displayName: fullName });

            // Save user to Firestore
            await createUser(userCredential.user.uid, {
                email: email,
                full_name: fullName,
                phone_number: phone || null,
                role: "seeker",
            });

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
                showsVerticalScrollIndicator={false}
            >
                <View
                    className="flex-1 px-6"
                    style={{ paddingTop: insets.top + 16 }}
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 mb-6"
                    >
                        <Monicon
                            name="material-symbols:arrow-back-rounded"
                            size={24}
                            color="#374151"
                        />
                    </TouchableOpacity>

                    {/* Header Section */}
                    <View className="mb-8">
                        {/* Icon */}
                        <View className="w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mb-5">
                            <Monicon
                                name="material-symbols:person-add-rounded"
                                size={28}
                                color="#1b988d"
                            />
                        </View>

                        {/* Title */}
                        <Text
                            weight="extrabold"
                            className="text-3xl text-gray-900 mb-2"
                        >
                            Buat Akun
                        </Text>
                        <Text className="text-base text-gray-500 leading-6">
                            Lengkapi data diri untuk mulai cari kosan-mu
                        </Text>
                    </View>

                    {/* Form */}
                    <View>
                        {/* Name Field */}
                        <View className="mb-4">
                            <Text
                                weight="bold"
                                className="text-xs uppercase tracking-wider text-gray-500 mb-2 ml-1"
                            >
                                Nama Lengkap
                            </Text>
                            <View className="flex-row items-center rounded-full bg-gray-50 border border-transparent">
                                <TextInput
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="John Doe"
                                    className="flex-1 h-12 px-4 text-gray-900"
                                    placeholderTextColor="#9aacac"
                                    style={{ fontFamily: "Manrope_400Regular" }}
                                />
                                <View className="pr-4">
                                    <Monicon
                                        name="material-symbols:person-rounded"
                                        size={22}
                                        color="#658683"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Email Field */}
                        <View className="mb-4">
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

                        {/* WhatsApp Field */}
                        <View className="mb-4">
                            <Text
                                weight="bold"
                                className="text-xs uppercase tracking-wider text-gray-500 mb-2 ml-1"
                            >
                                No. WhatsApp (Opsional)
                            </Text>
                            <View className="flex-row items-center rounded-full bg-gray-50 border border-transparent">
                                <TextInput
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Sertakan 62. Contoh: 628123456789"
                                    keyboardType="phone-pad"
                                    className="flex-1 h-12 px-4 text-gray-900"
                                    placeholderTextColor="#9aacac"
                                    style={{ fontFamily: "Manrope_400Regular" }}
                                />
                                <View className="pr-4">
                                    <Monicon
                                        name="mdi:whatsapp"
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
                                    placeholder="Minimal 6 karakter"
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

                        {/* Terms Checkbox */}
                        <TouchableOpacity
                            onPress={() => setAgreedToTerms(!agreedToTerms)}
                            className="flex-row items-start mb-4"
                        >
                            <View
                                className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 mt-0.5 ${agreedToTerms ? "bg-primary border-primary" : "border-gray-300"}`}
                            >
                                {agreedToTerms && (
                                    <Monicon
                                        name="material-symbols:check-rounded"
                                        size={14}
                                        color="#ffffff"
                                    />
                                )}
                            </View>
                            <Text className="flex-1 text-sm text-gray-600">
                                Saya setuju dengan{" "}
                                <Text
                                    weight="semibold"
                                    className="text-primary"
                                >
                                    Syarat & Ketentuan
                                </Text>{" "}
                                dan{" "}
                                <Text
                                    weight="semibold"
                                    className="text-primary"
                                >
                                    Kebijakan Privasi
                                </Text>{" "}
                                MauNgekos
                            </Text>
                        </TouchableOpacity>

                        {/* Register Button */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={isLoading}
                            className={`flex-row items-center justify-center rounded-full h-14 mt-2 ${agreedToTerms ? "bg-primary" : "bg-gray-300"}`}
                            style={
                                agreedToTerms
                                    ? {
                                          shadowColor: "#1b988d",
                                          shadowOffset: { width: 0, height: 4 },
                                          shadowOpacity: 0.3,
                                          shadowRadius: 8,
                                          elevation: 6,
                                      }
                                    : {}
                            }
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <>
                                    <Text
                                        weight="bold"
                                        className="text-white text-base"
                                    >
                                        Daftar Sekarang
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
                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-px bg-gray-200" />
                        <Text className="mx-4 text-xs text-gray-400">
                            Atau kamu juga bisa daftar dengan
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

                    {/* Login Link */}
                    <View
                        className="flex-row justify-center pt-6"
                        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
                    >
                        <Text className="text-sm text-gray-500">
                            Sudah punya akun?
                        </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text
                                weight="bold"
                                className="text-sm text-primary ml-1"
                            >
                                Masuk
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

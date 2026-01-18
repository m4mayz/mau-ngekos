import Text from "@/components/ui/Text";
import { Monicon } from "@monicon/native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SavedScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-gray-50">
            <View
                className="bg-primary px-6 pb-6"
                style={{ paddingTop: insets.top + 16 }}
            >
                <Text weight="bold" className="text-2xl text-white">
                    Disimpan
                </Text>
                <Text className="mt-1 text-white/80">Kos favoritmu</Text>
            </View>

            <View className="flex-1 items-center justify-center px-6">
                <Monicon
                    name="material-symbols:bookmark-rounded"
                    size={64}
                    color="#D1D5DB"
                />
                <Text
                    weight="semibold"
                    className="mt-4 text-lg text-gray-500 text-center"
                >
                    Belum ada kos yang disimpan
                </Text>
                <Text className="mt-2 text-gray-400 text-center">
                    Tap ikon bookmark di detail kos untuk menyimpan
                </Text>
            </View>
        </View>
    );
}

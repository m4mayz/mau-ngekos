import StatusBadge from "@/components/ui/StatusBadge";
import Text from "@/components/ui/Text";
import { Image, TouchableOpacity, View } from "react-native";

interface KosCardProps {
    id: string;
    name: string;
    address: string;
    price: number;
    status: "pending" | "approved" | "rejected";
    imageUrl?: string;
    date?: string;
    onPress?: () => void;
}

export default function KosCard({
    name,
    address,
    price,
    status,
    imageUrl,
    date,
    onPress,
}: KosCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.8 : 1}
            className="mb-4 rounded-2xl bg-white p-4 shadow"
        >
            {imageUrl && (
                <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-32 rounded-xl mb-3"
                    resizeMode="cover"
                />
            )}
            <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                    <Text weight="semibold" className="text-lg text-gray-900">
                        {name}
                    </Text>
                    <Text
                        className="mt-1 text-sm text-gray-500"
                        numberOfLines={2}
                    >
                        {address}
                    </Text>
                </View>
                <StatusBadge type={status} size="sm" />
            </View>
            <View className="mt-3 flex-row items-center justify-between">
                <Text weight="bold" className="text-lg text-primary">
                    {formatPrice(price)}
                    <Text className="text-sm text-gray-500">/bln</Text>
                </Text>
                {date && <Text className="text-sm text-gray-400">{date}</Text>}
            </View>
        </TouchableOpacity>
    );
}

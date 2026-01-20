import Text from "@/components/ui/Text";
import { Monicon } from "@monicon/native";
import { TouchableOpacity, View } from "react-native";

interface MenuItemProps {
    icon: string;
    iconColor?: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    variant?: "default" | "danger";
    hasBorder?: boolean;
}

export default function MenuItem({
    icon,
    iconColor,
    title,
    subtitle,
    onPress,
    showChevron = true,
    variant = "default",
    hasBorder = true,
}: MenuItemProps) {
    const isDanger = variant === "danger";
    const defaultIconColor = isDanger ? "#EF4444" : iconColor || "#6B7280";
    const textColor = isDanger ? "text-red-500" : "text-gray-900";

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            className={`flex-row items-center px-4 py-4 ${hasBorder ? "border-b border-gray-100" : ""}`}
        >
            <Monicon name={icon} size={24} color={defaultIconColor} />
            <View className="ml-4 flex-1">
                <Text weight="medium" className={textColor}>
                    {title}
                </Text>
                {subtitle && (
                    <Text className="text-sm text-gray-500">{subtitle}</Text>
                )}
            </View>
            {showChevron && onPress && (
                <Monicon
                    name="material-symbols:chevron-right-rounded"
                    size={24}
                    color="#9CA3AF"
                />
            )}
        </Container>
    );
}

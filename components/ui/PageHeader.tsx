import Text from "@/components/ui/Text";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    bgColor?: string;
}

export default function PageHeader({
    title,
    subtitle,
    bgColor = "bg-primary",
}: PageHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            className={`${bgColor} px-6 pb-6`}
            style={{ paddingTop: insets.top + 16 }}
        >
            <Text weight="bold" className="text-2xl text-white">
                {title}
            </Text>
            {subtitle && <Text className="mt-1 text-white/80">{subtitle}</Text>}
        </View>
    );
}

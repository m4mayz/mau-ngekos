import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { Monicon } from "@monicon/native";
import { View } from "react-native";

interface EmptyStateProps {
    icon: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <View className="mt-20 items-center px-6">
            <Monicon name={icon} size={64} color="#9CA3AF" />
            <Text
                weight="medium"
                className="mt-4 text-center text-lg text-gray-500"
            >
                {title}
            </Text>
            {description && (
                <Text className="mt-2 text-center text-gray-400">
                    {description}
                </Text>
            )}
            {actionLabel && onAction && (
                <Button
                    onPress={onAction}
                    variant="primary"
                    size="md"
                    className="mt-6"
                >
                    {actionLabel}
                </Button>
            )}
        </View>
    );
}

import Text from "@/components/ui/Text";
import { Monicon } from "@monicon/native";
import { TouchableOpacity, View } from "react-native";

interface FilterChipProps {
    label: string;
    isActive?: boolean;
    hasValue?: boolean;
    onPress: () => void;
    showDropdown?: boolean;
}

export default function FilterChip({
    label,
    isActive = false,
    hasValue = false,
    onPress,
    showDropdown = true,
}: FilterChipProps) {
    const bgColor = isActive || hasValue ? "bg-primary" : "bg-white";
    const textColor = isActive || hasValue ? "text-white" : "text-primary";
    const borderColor =
        isActive || hasValue ? "border-primary" : "border-gray-200";
    const iconColor = isActive || hasValue ? "#ffffff" : "#1b988d";

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center px-4 h-9 rounded-full ${bgColor} border ${borderColor} mr-3 shadow-sm`}
            activeOpacity={0.8}
        >
            <Text weight="medium" className={`text-sm ${textColor}`}>
                {label}
            </Text>
            {showDropdown && (
                <View style={{ marginLeft: 2 }}>
                    <Monicon
                        name="material-symbols:expand-more-rounded"
                        size={18}
                        color={iconColor}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}

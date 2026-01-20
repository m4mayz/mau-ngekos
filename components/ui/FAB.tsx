import { Monicon } from "@monicon/native";
import { TouchableOpacity } from "react-native";

interface FABProps {
    icon: string;
    onPress: () => void;
    bottom?: number;
}

export default function FAB({ icon, onPress, bottom = 100 }: FABProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="absolute right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
            style={{ bottom }}
            activeOpacity={0.8}
        >
            <Monicon name={icon} size={28} color="#ffffff" />
        </TouchableOpacity>
    );
}

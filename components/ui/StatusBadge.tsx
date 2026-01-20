import Text from "@/components/ui/Text";
import { View } from "react-native";

type BadgeType =
    | "pending"
    | "approved"
    | "rejected"
    | "seeker"
    | "owner"
    | "admin";
type BadgeSize = "sm" | "md";

interface StatusBadgeProps {
    type: BadgeType;
    size?: BadgeSize;
    customLabel?: string;
}

const badgeConfig = {
    pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Menunggu",
    },
    approved: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Disetujui",
    },
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak" },
    seeker: { bg: "bg-blue-100", text: "text-blue-700", label: "Pencari Kos" },
    owner: { bg: "bg-green-100", text: "text-green-700", label: "Pemilik Kos" },
    admin: { bg: "bg-purple-100", text: "text-purple-700", label: "Admin" },
};

const sizeConfig = {
    sm: { padding: "px-2 py-0.5", fontSize: "text-xs" },
    md: { padding: "px-3 py-1", fontSize: "text-sm" },
};

export default function StatusBadge({
    type,
    size = "md",
    customLabel,
}: StatusBadgeProps) {
    const config = badgeConfig[type];
    const sizeStyle = sizeConfig[size];

    return (
        <View className={`rounded-full ${config.bg} ${sizeStyle.padding}`}>
            <Text
                weight="medium"
                className={`${config.text} ${sizeStyle.fontSize}`}
            >
                {customLabel || config.label}
            </Text>
        </View>
    );
}

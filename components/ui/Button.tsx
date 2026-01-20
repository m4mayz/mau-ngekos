import Text from "@/components/ui/Text";
import { Monicon } from "@monicon/native";
import {
    ActivityIndicator,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    isFullWidth?: boolean;
    leftIcon?: string;
    rightIcon?: string;
}

const variantStyles = {
    primary: {
        bg: "bg-primary",
        text: "text-white",
        border: "",
        iconColor: "#ffffff",
    },
    secondary: {
        bg: "bg-gray-100",
        text: "text-gray-900",
        border: "",
        iconColor: "#374151",
    },
    danger: {
        bg: "bg-red-500",
        text: "text-white",
        border: "",
        iconColor: "#ffffff",
    },
    outline: {
        bg: "bg-transparent",
        text: "text-primary",
        border: "border-2 border-primary",
        iconColor: "#1b988d",
    },
};

const sizeStyles = {
    sm: { height: "h-10", padding: "px-4", iconSize: 16, fontSize: "text-sm" },
    md: {
        height: "h-12",
        padding: "px-5",
        iconSize: 20,
        fontSize: "text-base",
    },
    lg: { height: "h-14", padding: "px-6", iconSize: 24, fontSize: "text-lg" },
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    isFullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    className = "",
    ...props
}: ButtonProps) {
    const vStyle = variantStyles[variant];
    const sStyle = sizeStyles[size];

    const isDisabled = disabled || isLoading;

    return (
        <TouchableOpacity
            className={`
                flex-row items-center justify-center rounded-full
                ${sStyle.height} ${sStyle.padding}
                ${vStyle.bg} ${vStyle.border}
                ${isFullWidth ? "w-full" : ""}
                ${isDisabled ? "opacity-50" : ""}
                ${className}
            `}
            disabled={isDisabled}
            activeOpacity={0.8}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={vStyle.iconColor} />
            ) : (
                <View className="flex-row items-center">
                    {leftIcon && (
                        <Monicon
                            name={leftIcon}
                            size={sStyle.iconSize}
                            color={vStyle.iconColor}
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <Text
                        weight="semibold"
                        className={`${vStyle.text} ${sStyle.fontSize}`}
                    >
                        {children}
                    </Text>
                    {rightIcon && (
                        <Monicon
                            name={rightIcon}
                            size={sStyle.iconSize}
                            color={vStyle.iconColor}
                            style={{ marginLeft: 8 }}
                        />
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

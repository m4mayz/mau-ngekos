import Text from "@/components/ui/Text";
import { Monicon } from "@monicon/native";
import { useState } from "react";
import {
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";

interface InputFieldProps extends TextInputProps {
    label?: string;
    leftIcon?: string;
    rightIcon?: string;
    onRightIconPress?: () => void;
    error?: string;
    isPassword?: boolean;
}

export default function InputField({
    label,
    leftIcon,
    rightIcon,
    onRightIconPress,
    error,
    isPassword = false,
    className = "",
    ...props
}: InputFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const hasError = !!error;

    return (
        <View className={className}>
            {label && (
                <Text weight="medium" className="mb-2 text-gray-700">
                    {label}
                </Text>
            )}
            <View
                className={`
                    flex-row items-center h-14 px-4 rounded-xl
                    ${
                        hasError
                            ? "bg-red-50 border border-red-300"
                            : isFocused
                              ? "bg-gray-50 border border-primary"
                              : "bg-gray-50 border border-transparent"
                    }
                `}
            >
                {leftIcon && (
                    <Monicon
                        name={leftIcon}
                        size={22}
                        color={
                            hasError
                                ? "#EF4444"
                                : isFocused
                                  ? "#1b988d"
                                  : "#9CA3AF"
                        }
                        style={{ marginRight: 12 }}
                    />
                )}
                <TextInput
                    className="flex-1 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    style={{
                        fontFamily: "Manrope_400Regular",
                        fontSize: 16,
                    }}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="ml-2 p-1"
                    >
                        <Monicon
                            name={
                                showPassword
                                    ? "material-symbols:visibility-off-rounded"
                                    : "material-symbols:visibility-rounded"
                            }
                            size={22}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                )}
                {rightIcon && !isPassword && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        className="ml-2 p-1"
                        disabled={!onRightIconPress}
                    >
                        <Monicon
                            name={rightIcon}
                            size={22}
                            color={hasError ? "#EF4444" : "#9CA3AF"}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text className="mt-1.5 text-sm text-red-500">{error}</Text>
            )}
        </View>
    );
}

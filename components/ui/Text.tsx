import React from "react";
import { Text as RNText, TextProps } from "react-native";

interface AppTextProps extends TextProps {
    weight?: "light" | "regular" | "medium" | "semibold" | "bold" | "extrabold";
}

const fontWeights = {
    light: "Manrope_300Light",
    regular: "Manrope_400Regular",
    medium: "Manrope_500Medium",
    semibold: "Manrope_600SemiBold",
    bold: "Manrope_700Bold",
    extrabold: "Manrope_800ExtraBold",
};

export default function Text({
    style,
    weight = "regular",
    children,
    ...props
}: AppTextProps) {
    return (
        <RNText style={[{ fontFamily: fontWeights[weight] }, style]} {...props}>
            {children}
        </RNText>
    );
}

// Export typed variants for convenience
export function TextLight(props: Omit<AppTextProps, "weight">) {
    return <Text weight="light" {...props} />;
}

export function TextMedium(props: Omit<AppTextProps, "weight">) {
    return <Text weight="medium" {...props} />;
}

export function TextSemiBold(props: Omit<AppTextProps, "weight">) {
    return <Text weight="semibold" {...props} />;
}

export function TextBold(props: Omit<AppTextProps, "weight">) {
    return <Text weight="bold" {...props} />;
}

export function TextExtraBold(props: Omit<AppTextProps, "weight">) {
    return <Text weight="extrabold" {...props} />;
}

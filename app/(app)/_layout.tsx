import { useAuth } from "@/contexts/AuthContext";
import { Monicon } from "@monicon/native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
    const { role } = useAuth();
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#1b988d",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopWidth: 1,
                    borderTopColor: "#F3F4F6",
                    paddingBottom: Math.max(insets.bottom, 8),
                    paddingTop: 8,
                    height: 70 + insets.bottom,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: "Manrope_600SemiBold",
                },
            }}
        >
            {/* Cari Kos - Map view for searching */}
            <Tabs.Screen
                name="(seeker)"
                options={{
                    title: "Cari Kos",
                    tabBarIcon: ({ color, size }) => (
                        <Monicon
                            name="material-symbols:location-on-rounded"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Disimpan - Saved/Favorites */}
            <Tabs.Screen
                name="saved"
                options={{
                    title: "Disimpan",
                    tabBarIcon: ({ color, size }) => (
                        <Monicon
                            name="material-symbols:bookmark-rounded"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Kos Saya - My rentals */}
            <Tabs.Screen
                name="my-kos"
                options={{
                    title: "Kos Saya",
                    tabBarIcon: ({ color, size }) => (
                        <Monicon
                            name="material-symbols:home-rounded"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Hidden screens - accessible via navigation but not in tab bar */}
            <Tabs.Screen
                name="(owner)"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="(admin)"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    href: null, // Hide from tab bar - accessed via search bar
                }}
            />
        </Tabs>
    );
}

import { useAuth } from "@/contexts/AuthContext";
import { Monicon } from "@monicon/native";
import { Tabs } from "expo-router";

export default function AppLayout() {
    const { role } = useAuth();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#6366F1",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopWidth: 1,
                    borderTopColor: "#E5E7EB",
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 65,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: "Manrope_500Medium",
                },
            }}
        >
            <Tabs.Screen
                name="(seeker)"
                options={{
                    title: "Cari Kos",
                    tabBarIcon: ({ color, size }) => (
                        <Monicon
                            name="material-symbols:search-rounded"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="(owner)"
                options={{
                    title: "Kos Saya",
                    tabBarIcon: ({ color, size }) => (
                        <Monicon
                            name="material-symbols:home-rounded"
                            size={size}
                            color={color}
                        />
                    ),
                    href:
                        role === "owner" || role === "admin" ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="(admin)"
                options={{
                    title: "Admin",
                    tabBarIcon: ({ color, size }) => (
                        <Monicon
                            name="material-symbols:admin-panel-settings-rounded"
                            size={size}
                            color={color}
                        />
                    ),
                    href: role === "admin" ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, size }) => (
                        <Monicon
                            name="material-symbols:person-rounded"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

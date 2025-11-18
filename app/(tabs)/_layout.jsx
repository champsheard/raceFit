import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";


export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarShowLabel: false
        }}>
            <Tabs.Screen name="index" options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home-outline" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name="teams" options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="list" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name="settings" options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings-outline" size={size} color={color} />
                ),
            }} />
        </Tabs>
    )
}
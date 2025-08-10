import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="follower_feed"
        options={{
          title: "Feed",
          tabBarIcon: () => null, // You can replace this with an icon later
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="personal_account"
        options={{
          title: "Profile",
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}

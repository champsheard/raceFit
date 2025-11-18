import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { TeamContext } from "../../context/TeamProvider";

export default function TeamLeaderboard() {
  const { teamId } = useLocalSearchParams();
  const { listenToTeam } = useContext(TeamContext);

  const [team, setTeam] = useState(null);

  useEffect(() => {
    const unsub = listenToTeam(teamId, setTeam);
    return unsub;
  }, []);

  if (!team) return <Text>Loading team...</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
        {team.name}
      </Text>

      <FlatList
        data={team.users}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: "#fff",
              borderRadius: 10,
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18 }}>
              #{index + 1} — {item.name}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.points} pts
            </Text>
          </View>
        )}
      />
    </View>
  );
}

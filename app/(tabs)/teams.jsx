import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { TeamContext } from "../../context/TeamProvider";

export default function TeamsPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { teams, getTeams, joinTeam, leaveTeam } = useContext(TeamContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    await getTeams();
    setLoading(false);
  };

  const isUserInTeam = (team) =>
    team.users.some((u) => u.id === user.uid);

  const toggleTeamMembership = async (team) => {
    if (isUserInTeam(team)) {
      await leaveTeam(team.id, user.uid);
    } else {
      await joinTeam(team.id, user.uid, {
        name: user.displayName || user.email,
      });
    }
    loadTeams();
  };

  if (loading) return <Text>Loading teams...</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Teams
      </Text>

      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const joined = isUserInTeam(item);

          return (
            <TouchableOpacity
              onPress={() => router.push(`/teams/${item.id}`)}
              style={{
                backgroundColor: "#f0f0f0",
                padding: 15,
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "600" }}>
                {item.name}
              </Text>

              <Text style={{ color: "gray" }}>
                Members: {item.users.length}
              </Text>

              <TouchableOpacity
                onPress={() => toggleTeamMembership(item)}
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: joined ? "red" : "green",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white" }}>
                  {joined ? "Leave Team" : "Join Team"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

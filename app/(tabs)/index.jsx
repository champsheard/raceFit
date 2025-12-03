// import { useContext, useEffect, useState } from "react";
// import { FlatList, Text, View } from "react-native";
// import { AuthContext } from "../../context/AuthContext";
// import { TeamContext } from "../../context/TeamProvider";

// export default function HomeScreen() {
//   const { user } = useContext(AuthContext);
//   const { getTeams } = useContext(TeamContext);

//   const [leaderboard, setLeaderboard] = useState([]);

//   useEffect(() => {
//     load();
//   }, []);

//   const load = async () => {
//     const teams = await getTeams();

//     // Teams the user is part of
//     const userTeams = teams.filter((t) =>
//       t.users.some((u) => u.id === user.uid)
//     );

//     const combined = [];

//     userTeams.forEach((team) => {
//       team.users.forEach((member) => {
//         combined.push({
//           id: member.id,
//           name: member.name,
//           points: member.points,
//           teamName: team.name,
//         });
//       });
//     });

//     combined.sort((a, b) => b.points - a.points);

//     setLeaderboard(combined);
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
//         Leaderboard
//       </Text>

//       {leaderboard.length === 0 ? (
//         <Text>No leaderboard data yet.</Text>
//       ) : (
//         <FlatList
//           data={leaderboard}
//           keyExtractor={(item) => item.id + item.teamName}
//           renderItem={({ item, index }) => (
//             <View
//               style={{
//                 padding: 15,
//                 backgroundColor: "#e8e8e8",
//                 marginBottom: 10,
//                 borderRadius: 10,
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={{ fontSize: 18 }}>
//                 #{index + 1} — {item.name} ({item.teamName})
//               </Text>
//               <Text style={{ fontSize: 18, fontWeight: "bold" }}>
//                 {item.points} pts
//               </Text>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }
import { Text } from "react-native"
export default function HomeScreen() {
  return(
    <Text>Hi</Text>
  )
}
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthContext } from '../../context/AuthContext';
import { TeamContext } from '../../context/TeamProvider';
import { theme } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { teams, getTeams } = useContext(TeamContext);
  const { userData } = useContext(AuthContext);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? theme.dark : theme.light;

  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      await getTeams();
    } finally {
      setLoading(false);
    }
  }, [getTeams]);

  useEffect(() => {
    fetchTeams();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fetchTeams]);

  const openSheet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSheetVisible(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 12,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSheetVisible(false));
  };

  const onSelectTeam = (id) => {
    Haptics.selectionAsync();
    setSelectedTeam(id);
    closeSheet();
  };

  const currentTeam = teams.find((t) => t.id === selectedTeam);

  const sheetTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [420, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.55],
  });

  const renderScore = ({ item, index }) => (
    <Animated.View style={[styles.scoreCard, { opacity: fadeAnim, backgroundColor: palette.card }]}>
      <View style={styles.scoreRank}>
        <Text style={[styles.scoreRankText, { color: palette.accent }]}>#{index + 1}</Text>
      </View>
      <View style={styles.scoreContent}>
        <Text style={[styles.scoreName, { color: palette.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.scorePoints}>
          <Text style={[styles.scorePointsText, { color: '#FFD700' }]}>🏆 {item.points}</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={{ flex: 1, backgroundColor: palette.backgroundGradient[0] }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ marginBottom: 20, opacity: fadeAnim }}>
            <Text style={[styles.greetingHey, { color: palette.textSecondary }]}>Hey there,</Text>
            <Text style={[styles.greetingName, { color: palette.text }]}>{userData?.name ?? 'Guest'}</Text>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, marginBottom: 24 }}>
            <TouchableOpacity activeOpacity={0.9} onPress={openSheet}>
              <BlurView intensity={60} tint={colorScheme} style={styles.heroCard}>
                <View style={styles.heroContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.heroLabel}>{currentTeam ? 'ACTIVE TEAM' : 'NO TEAM SELECTED'}</Text>
                    <Text style={[styles.heroTeamName, { color: '#fff' }]} numberOfLines={1}>
                      {currentTeam?.name ?? 'Select Your Team'}
                    </Text>
                  </View>
                  <View style={styles.heroPoints}>
                    <Text style={styles.heroPointsLabel}>POINTS</Text>
                    <Text style={styles.heroPointsValue}>{currentTeam?.points ?? 0}</Text>
                  </View>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {currentTeam && (
            <Animated.View style={{ opacity: fadeAnim, marginBottom: 28 }}>
              <Text style={[styles.sectionTitle, { color: palette.text }]}>Performance</Text>
              <View style={styles.statsGrid}>
                <BlurView intensity={50} tint={colorScheme} style={styles.statBox}>
                  <Text style={[styles.statValue, { color: palette.text }]}>{currentTeam.points}</Text>
                  <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Total Points</Text>
                </BlurView>

                <BlurView intensity={50} tint={colorScheme} style={styles.statBox}>
                  <Text style={[styles.statValue, { color: palette.text }]}>{currentTeam.hours}</Text>
                  <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Hours Logged</Text>
                </BlurView>

                <BlurView intensity={50} tint={colorScheme} style={styles.statBox}>
                  <Text style={[styles.statValue, { color: palette.text }]}>{currentTeam.members?.length ?? 0}</Text>
                  <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Team Members</Text>
                </BlurView>

                <BlurView intensity={50} tint={colorScheme} style={styles.statBox}>
                  <Text style={[styles.statValue, { color: palette.text }]}>
                    {currentTeam.points > 0 ? Math.round(currentTeam.points / (currentTeam.members?.length || 1)) : 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Avg per Member</Text>
                </BlurView>
              </View>
            </Animated.View>
          )}

          {currentTeam && (
            <View>
              <Text style={[styles.sectionTitle, { color: palette.text }]}>Leaderboard</Text>
              {loading ? (
                <ActivityIndicator size="large" color={palette.accent} style={{ marginTop: 28 }} />
              ) : (
                <FlatList
                  data={currentTeam.scores || []}
                  renderItem={renderScore}
                  keyExtractor={(item, i) => i.toString()}
                  scrollEnabled={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              )}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/addPoints');
          }}
          style={styles.fab}
        >
          <BlurView intensity={80} tint={colorScheme} style={styles.fabGradient}>
            <Text style={{ fontSize: 28, color: '#fff' }}>＋</Text>
          </BlurView>
        </TouchableOpacity>

        <Modal visible={sheetVisible} transparent animationType="none" statusBarTranslucent>
          <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: backdropOpacity }]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={closeSheet} activeOpacity={1} />
          </Animated.View>

          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
            <BlurView intensity={50} tint={colorScheme} style={styles.sheetBlur}>
              <View style={styles.sheetHandle} />
              <ScrollView showsVerticalScrollIndicator={false} style={styles.sheetScroll}>
                {loading ? (
                  <ActivityIndicator style={{ marginTop: 28 }} color={palette.accent} />
                ) : (
                  teams.map((team) => (
                    <TouchableOpacity
                      key={team.id}
                      onPress={() => onSelectTeam(team.id)}
                      style={[styles.teamOption, { backgroundColor: team.id === selectedTeam ? palette.inputBackground : 'transparent' }]}
                    >
                      <Text style={[styles.teamOptionName, { color: palette.text }]}>{team.name}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </BlurView>
          </Animated.View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingBottom: 110 },
  greetingHey: { fontSize: 15, fontWeight: '600', opacity: 0.75, marginBottom: 4 },
  greetingName: { fontSize: 30, fontWeight: '900' },
  heroCard: { borderRadius: 24, padding: 20, marginBottom: 24, overflow: 'hidden' },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 6, color: '#fff' },
  heroTeamName: { fontSize: 24, fontWeight: '900' },
  heroPoints: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)' },
  heroPointsLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, opacity: 0.9 },
  heroPointsValue: { fontSize: 26, fontWeight: '900', marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statBox: { width: (width - 56) / 2, padding: 16, borderRadius: 16, marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600' },
  scoreCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 10 },
  scoreRank: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  scoreRankText: { fontSize: 13, fontWeight: '900' },
  scoreContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreName: { fontSize: 15, fontWeight: '700', flex: 1 },
  scorePoints: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scorePointsText: { fontSize: 15, fontWeight: '800' },
  fab: { position: 'absolute', right: 20, bottom: 32, borderRadius: 28 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '78%', paddingHorizontal: 12, paddingBottom: 22 },
  sheetBlur: { borderRadius: 18, overflow: 'hidden', paddingBottom: 12 },
  sheetHandle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: 'rgba(60,60,60,0.3)', marginVertical: 10 },
  sheetScroll: { maxHeight: 460, paddingHorizontal: 12, paddingBottom: 12 },
  teamOption: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 10 },
  teamOptionName: { fontSize: 16, fontWeight: '800' },
});

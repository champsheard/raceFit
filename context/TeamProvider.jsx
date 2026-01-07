import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../utils/firebase";

export const TeamContext = createContext();

/* ---------------------- HELPER: LOG POINTS TO USER DOC --------- */
const logPointsToUser = async (userId, teamId, amount, meta = {}) => {
  try {
    const pointsLogRef = doc(collection(db, "users", userId, "points"));
    await setDoc(pointsLogRef, {
      teamId,
      amount,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      ...meta,
    });
  } catch (error) {
    console.error("Error logging points to user:", error);
  }
};

export function TeamProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);


  /* ---------------------- GENERATE JOIN CODE ---------------------- */
  const generateJoinCode = () => Math.floor(10000000 + Math.random() * 90000000).toString();

  /* ---------------------- CREATE TEAM ----------------------------- */
  const createTeam = async (name, description) => {
    try {
      const code = generateJoinCode();
      const teamRef = doc(collection(db, "teams"));
      const ownerID = user.uid

      await setDoc(teamRef, {
        name: name.trim(),
        owner: ownerID,
        description,
        createdAt: new Date().toISOString(),
        joinCode: {
          code,
          createdAt: new Date().toISOString(),
        },
      });

      await setDoc(doc(db, "joinCodes", code), {
        teamId: teamRef.id,
        createdAt: new Date().toISOString(),
      });

      await setDoc(doc(db, "teams", teamRef.id, "users", ownerID), {
        name: user.displayName || "Unnamed",
        points: 0,
        id: ownerID,
        joinedAt: new Date().toISOString(),
        lastPointChange: null,
        dailyPoints: {},
        weeklyPoints: 0,
      });

      return teamRef.id;
    } catch (error) {
      console.error("Error creating team:", error);
      return null;
    }
  };

  /* ---------------------- GET TEAMS USER IS IN ------------------- */
  const getTeams = async () => {
    if (!user) return [];
    try {
      const teamsSnapshot = await getDocs(collection(db, "teams"));

      const userTeams = await Promise.all(
        teamsSnapshot.docs.map(async (teamDoc) => {
          const userRef = doc(db, "teams", teamDoc.id, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) return null;

          const usersSnapshot = await getDocs(collection(db, "teams", teamDoc.id, "users"));
          const users = usersSnapshot.docs.map((u) => ({ id: u.id, ...u.data() }))
            .sort((a, b) => b.points - a.points);

          return { id: teamDoc.id, ...teamDoc.data(), users };
        })
      );

      return userTeams.filter(Boolean);
    } catch (error) {
      console.error("Error loading teams:", error);
      return [];
    }
  };

  /* ---------------------- REALTIME LISTENER ---------------------- */
  const listenToAllTeams = () => {
    if (!user) return () => { };

    setLoadingTeams(true);

    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      (async () => {
        const rawTeams = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        const userTeams = await Promise.all(
          rawTeams.map(async (team) => {
            const userRef = doc(db, "teams", team.id, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) return null;

            const usersSnapshot = await getDocs(collection(db, "teams", team.id, "users"));
            const users = usersSnapshot.docs.map((u) => ({ id: u.id, ...u.data() }))
              .sort((a, b) => b.points - a.points);

            return { ...team, users };
          })
        );

        setTeams(userTeams.filter(Boolean));
        setLoadingTeams(false);
      })();
    });

    return unsubscribe;
  };

/* ---------------------- JOIN / LEAVE / POINTS ------------------ */
const joinTeamByCode = async (code, userInfo = {}) => {
  if (!user) return { success: false, error: "No user logged in." };

  try {
    if (!/^\d{8}$/.test(code)) return { success: false, error: "Invalid code format (8 digits)." };

    const codeRef = doc(db, "joinCodes", code);
    const codeSnap = await getDoc(codeRef);
    if (!codeSnap.exists()) return { success: false, error: "No team found with that code." };

    const teamId = codeSnap.data().teamId;
    const userRef = doc(db, "teams", teamId, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: false, error: "User is already in the team." };
    }

    await setDoc(userRef, {
      name: userInfo.name || "Unnamed",
      points: 0,
      joinedAt: new Date().toISOString(),
      lastPointChange: null,
      ...userInfo,
    });

    return { success: true, teamId };
  } catch (error) {
    console.error("Error joining team by code:", error);
    return { success: false, error: "Unexpected error." };
  }
};


  const leaveTeam = async (teamId) => {
    if (!user) return false;

    const team = teams.find((t) => t.id === teamId);
    if (!team) return false;

    if (user.uid === team.owner) {
      alert("You cannot leave a team you own.");
      return false;
    }

    try {
      await deleteDoc(doc(db, "teams", teamId, "users", user.uid));
      return true;
    } catch (error) {
      console.error("Error leaving team:", error);
      return false;
    }
  };

  const addPoints = async (teamId, userId, amount) => {
    try {
      const userRef = doc(db, "teams", teamId, "users", userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return false;

      const today = new Date().toISOString().split("T")[0];
      const userData = snap.data();
      const dailyPoints = userData.dailyPoints || {};
      const currentDailyPoints = dailyPoints[today] || 0;

      await updateDoc(userRef, {
        points: (userData.points || 0) + amount,
        weeklyPoints: (userData.weeklyPoints || 0) + amount,
        dailyPoints: {
          ...dailyPoints,
          [today]: currentDailyPoints + amount,
        },
        lastPointChange: { 
          timestamp: new Date().toISOString(), 
          amount,
          date: today,
        },
      });

      // Log points to user's points subcollection
      await logPointsToUser(userId, amount);

      return true;
    } catch (error) {
      console.error("Error adding points:", error);
      return false;
    }
  };

  const updateUserPoints = async (teamId, userId, newPoints) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const userRef = doc(db, "teams", teamId, "users", userId);
      const snap = await getDoc(userRef);
      const userData = snap.data();
      const dailyPoints = userData?.dailyPoints || {};
      
      await updateDoc(userRef, {
        points: newPoints,
        weeklyPoints: newPoints,
        dailyPoints: {
          ...dailyPoints,
          [today]: newPoints,
        },
        lastPointChange: { 
          timestamp: new Date().toISOString(), 
          amount: newPoints,
          date: today,
        },
      });

      // Log points to user's points subcollection
      await logPointsToUser(userId, teamId, newPoints, { isUpdate: true });

      return true;
    } catch (error) {
      console.error("Error updating points:", error);
      return false;
    }
  };

  const listenToTeam = (teamId, callback) => {
    const teamRef = doc(db, "teams", teamId);

    return onSnapshot(teamRef, async (teamDoc) => {
      if (!teamDoc.exists()) return callback(null);

      const usersSnapshot = await getDocs(collection(db, "teams", teamId, "users"));
      const users = usersSnapshot.docs.map((u) => ({ id: u.id, ...u.data() }))
        .sort((a, b) => b.weeklyPoints - a.weeklyPoints);

      callback({ id: teamDoc.id, ...teamDoc.data(), users });
    });
  };

  // Get daily breakdown for a user in a team
  const getUserDailyBreakdown = (user) => {
    if (!user?.dailyPoints) return {};
    return user.dailyPoints;
  };

  // Reset weekly points (call this at the start of each week)
  const resetWeeklyPoints = async (teamId) => {
    try {
      const usersSnapshot = await getDocs(collection(db, "teams", teamId, "users"));
      
      const ops = usersSnapshot.docs.map((userDoc) => {
        return updateDoc(doc(db, "teams", teamId, "users", userDoc.id), {
          weeklyPoints: 0,
          dailyPoints: {},
        });
      });

      await Promise.all(ops);
      return true;
    } catch (error) {
      console.error("Error resetting weekly points:", error);
      return false;
    }
  };

  // Clear all activity logs for a team (call at the end of the week)
  const clearWeeklyActivityLog = async (teamId) => {
    try {
      const activitiesSnapshot = await getDocs(
        collection(db, "teams", teamId, "activities")
      );

      const ops = activitiesSnapshot.docs.map((activityDoc) => {
        return deleteDoc(doc(db, "teams", teamId, "activities", activityDoc.id));
      });

      await Promise.all(ops);
      return true;
    } catch (error) {
      console.error("Error clearing activity log:", error);
      return false;
    }
  };

  // Get activity log for a team
  const getWeeklyActivityLog = async (teamId) => {
    try {
      const activitiesSnapshot = await getDocs(
        collection(db, "teams", teamId, "activities")
      );

      return activitiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching activity log:", error);
      return [];
    }
  };
  const addPointsToMembers = async (teamId, userIds = [], amount, meta = {}) => {
  try {
    if (!teamId || !userIds.length || !amount) return false;

    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toISOString();

    // Collect user data for activity log
    const users = [];
    const updateOps = [];

    for (const userId of userIds) {
      const userRef = doc(db, "teams", teamId, "users", userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) continue;

      const userData = snap.data();
      users.push({
        userId,
        userName: userData.name || "Unnamed",
      });

      const dailyPoints = userData.dailyPoints || {};
      const currentDailyPoints = dailyPoints[today] || 0;
      const prev = userData.points || 0;

      const lastPointChangeData = {
        timestamp: now,
        amount,
        date: today,
        ...meta,
      };

      updateOps.push(
        updateDoc(userRef, {
          points: prev + amount,
          weeklyPoints: (userData.weeklyPoints || 0) + amount,
          dailyPoints: {
            ...dailyPoints,
            [today]: currentDailyPoints + amount,
          },
          lastPointChange: lastPointChangeData,
        })
      );
    }

    // Log activity with array of users
    const activityLogRef = doc(
      collection(db, "teams", teamId, "activities")
    );
    await setDoc(activityLogRef, {
      users,
      amount,
      timestamp: now,
      date: today,
      ...meta,
    });

    await Promise.all(updateOps);

    // Log points for each user in their points subcollection
    const logOps = userIds.map((userId) =>
      logPointsToUser(userId, teamId, amount, meta)
    );
    await Promise.all(logOps);

    return true;
  } catch (error) {
    console.error("Error adding points to multiple members:", error);
    return false;
  }
};


  /* ---------------------- AUTO LISTEN TO TEAMS ------------------ */
  useEffect(() => {
    if (!user) return;
    const unsub = listenToAllTeams();
    return () => unsub();
  }, [user]);

  return (
    <TeamContext.Provider
      value={{
    teams,
    loadingTeams,
    getTeams,
    createTeam,
    joinTeam: joinTeamByCode,
    leaveTeam,

    // points
    addPoints,
    addPointsToMembers,
    updateUserPoints,

    listenToTeam,
    getUserDailyBreakdown,
    resetWeeklyPoints,
    clearWeeklyActivityLog,
    getWeeklyActivityLog,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

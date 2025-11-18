import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { createContext, useState } from "react";
import { db } from "../utils/firebase";

export const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // ---------------------------------------------------
  // CREATE A TEAM
  // ---------------------------------------------------
  const createTeam = async (name, info, ownerID, userInfo, description, resetInterval = {}) => {
    try {
      const teamRef = doc(collection(db, "teams"));

      await setDoc(teamRef, {
        name: name.trim(),
        owner: ownerID,
        users: [userInfo],
        resetInterval: resetInterval,
        description: description,
        createdAt: new Date().toISOString(),
      });

      return teamRef.id;
    } catch (error) {
      console.error("Error creating team:", error);
      return null;
    }
  };

  // ---------------------------------------------------
//   // GET ONE TEAM (with sorted users)
//   // ---------------------------------------------------
//   const getTeam = async (teamId) => {
//     try {
//       const teamDoc = await getDoc(doc(db, "teams", teamId));
//       if (!teamDoc.exists()) return null;

//       const usersRef = collection(db, "teams", teamId, "users");
//       const usersSnapshot = await getDocs(usersRef);

//       const users = usersSnapshot.docs
//         .map((u) => ({ id: u.id, ...u.data() }))
//         .sort((a, b) => b.points - a.points);

//       return {
//         id: teamDoc.id,
//         ...teamDoc.data(),
//         users,
//       };
//     } catch (error) {
//       console.error("Error loading team:", error);
//       return null;
//     }
//   };


  // ---------------------------------------------------
  // JOIN TEAM (user can join multiple teams)
  // ---------------------------------------------------
  const joinTeam = async (teamId, userId, userInfo = {}) => {
    try {
      const userRef = doc(db, "teams", teamId, "users", userId);

      await setDoc(userRef, {
        name: userInfo.name || "Unnamed",
        points: 0,
        joinedAt: new Date().toISOString(),
        lastPointChange: null,
        ...userInfo,
      });

      return true;
    } catch (error) {
      console.error("Error joining team:", error);
      return false;
    }
  };

  // ---------------------------------------------------
  // LEAVE TEAM (delete from subcollection)
  // ---------------------------------------------------
  const leaveTeam = async (teamId, userId) => {
    try {
      await deleteDoc(doc(db, "teams", teamId, "users", userId));
      return true;
    } catch (error) {
      console.error("Error leaving team:", error);
      return false;
    }
  };

  // ---------------------------------------------------
  // ADD POINTS (increment)
  // ---------------------------------------------------
  const addPoints = async (teamId, userId, amount) => {
    try {
      const userRef = doc(db, "teams", teamId, "users", userId);
      const snap = await getDoc(userRef);

      if (!snap.exists()) return false;

      const prev = snap.data().points || 0;
      const newTotal = prev + amount;

      await updateDoc(userRef, {
        points: newTotal,
        lastPointChange: {
          timestamp: new Date().toISOString(),
          amount: amount,
        },
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Error adding points:", error);
      return false;
    }
  };

  // ---------------------------------------------------
  // SET USER POINTS (overwrite)
  // ---------------------------------------------------
  const updateUserPoints = async (teamId, userId, newPoints) => {
    try {
      await updateDoc(doc(db, "teams", teamId, "users", userId), {
        points: newPoints,
        lastPointChange: {
          timestamp: new Date().toISOString(),
          amount: newPoints,
        },
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Error updating points:", error);
      return false;
    }
  };

  // ---------------------------------------------------
  // REAL-TIME TEAM LISTENER (live scoreboard)
  // ---------------------------------------------------
  const listenToTeam = (teamId, callback) => {
    const teamRef = doc(db, "teams", teamId);

    return onSnapshot(teamRef, async (teamDoc) => {
      if (!teamDoc.exists()) {
        callback(null);
        return;
      }

      const usersSnapshot = await getDocs(
        collection(db, "teams", teamId, "users")
      );

      const users = usersSnapshot.docs
        .map((u) => ({ id: u.id, ...u.data() }))
        .sort((a, b) => b.points - a.points);

      callback({
        id: teamDoc.id,
        ...teamDoc.data(),
        users,
      });
    });
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        loadingTeams,
        getTeam,
        getTeams,
        createTeam,
        joinTeam,
        leaveTeam,
        addPoints,
        updateUserPoints,
        listenToTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

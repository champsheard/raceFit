import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../utils/firebase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // -------------------------------
  // AUTH STATE LISTENER
  // -------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await reload(currentUser);

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        setUser(currentUser);
        setUserData(
          userDoc.exists()
            ? userDoc.data()
            : { email: currentUser.email }
        );

        setIsUserAuthenticated(currentUser.emailVerified);
      } else {
        setUser(null);
        setUserData(null);
        setIsUserAuthenticated(false);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // -------------------------------
  // SEND EMAIL VERIFICATION
  // -------------------------------
  const sendVerificationEmail = async (user) => {
    if (!user) return;
    try {
      await sendEmailVerification(user);
      Alert.alert(
        "Verification Email Sent",
        "Please check your inbox and verify your email."
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // -------------------------------
  // REGISTER USER
  // -------------------------------
  const registerUser = async (email, password, name, birthday, errors = {}) => {
    if (!email || !password || !name || !birthday) {
      Alert.alert("Error", "Please fill in all fields including birthday.");
      return;
    }
    if (Object.keys(errors).length > 0) {
      Alert.alert("Invalid Fields", "Please correct highlighted fields.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        name: name.trim(),
        email: newUser.email,
        birthday: birthday.toISOString(),
        createdAt: new Date().toISOString(),
        lastLoggedIn: new Date().toISOString(),
        emailVerified: false,
      });

      await sendVerificationEmail(newUser);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // LOGIN USER
  // -------------------------------
  const login = async (email, password, errors = {}) => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (Object.keys(errors).length > 0) {
      Alert.alert("Invalid Fields", "Please correct highlighted fields.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const loggedInUser = userCredential.user;

      await reload(loggedInUser);

      if (!loggedInUser.emailVerified) {
        await sendVerificationEmail(loggedInUser);

        Alert.alert(
          "Email Verification Required",
          "Please verify your email before logging in."
        );
        return;
      }

      await updateDoc(doc(db, "users", loggedInUser.uid), {
        lastLoggedIn: new Date().toISOString(),
        emailVerified: true,
      });

      setUser(loggedInUser);
      setIsUserAuthenticated(true);

      router.replace("(tabs)");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // LOGOUT
  // -------------------------------
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setIsUserAuthenticated(false);
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isUserAuthenticated,
        registerUser,
        login,
        logout,
        sendVerificationEmail,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

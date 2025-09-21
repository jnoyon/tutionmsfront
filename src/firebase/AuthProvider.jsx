import React, { createContext, useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { db } from "../firebase/firebase.init";
import { doc, onSnapshot } from "firebase/firestore";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // ✅ only for auth state

  useEffect(() => {
    const storedStudent = localStorage.getItem("loggedInStudent");

    if (storedStudent) {
      const student = JSON.parse(storedStudent);
      setUser(student);

      // listen silently, don't set global loading
      const unsub = onSnapshot(doc(db, "students", student.id), (docSnap) => {
        if (docSnap.exists()) {
          const updatedStudent = { id: docSnap.id, ...docSnap.data() };
          setUser(updatedStudent);
          localStorage.setItem(
            "loggedInStudent",
            JSON.stringify(updatedStudent)
          );
        }
      });

      setAuthLoading(false); // ✅ user already known from localStorage
      return () => unsub();
    }

    // Firebase Auth listener (for admins)
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ uid: currentUser.uid, email: currentUser.email });
      } else if (!storedStudent) {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, [auth]);

  const signInUser = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser({ uid: cred.user.uid, email: cred.user.email });
    return cred;
  };

  const logOut = async () => {
    if (user?.uid) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem("loggedInStudent");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, signInUser, logOut, loading: authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

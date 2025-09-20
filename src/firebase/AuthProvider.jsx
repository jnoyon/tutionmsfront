import React, { createContext, useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedStudent = localStorage.getItem("loggedInStudent");
    if (storedStudent) {
      setUser(JSON.parse(storedStudent));
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Admin logged in
        setUser({ uid: currentUser.uid, email: currentUser.email });
      } else if (!storedStudent) {
        // No admin, no student
        setUser(null);
      }
      setLoading(false); // ✅ Done loading after checking Firebase auth
    });

    // If student exists in localStorage but no Firebase auth (normal case), finish loading
    if (storedStudent && !auth.currentUser) setLoading(false);

    return () => unsubscribe();
  }, [auth]);

  const signInUser = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser({ uid: cred.user.uid, email: cred.user.email });
    return cred;
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("loggedInStudent");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signInUser, logOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

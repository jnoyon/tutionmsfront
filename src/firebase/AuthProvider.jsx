import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase.init";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get Firestore user document by email
        const q = query(collection(db, "students"), where("user", "==", currentUser.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setUser({
            ...currentUser,
            isActive: userData.isActive ?? true, // default true if field missing
          });
        } else {
          // If no Firestore doc, default active
          setUser({ ...currentUser, isActive: true });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const authInfo = { user, loading, setUser, logOut };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
}

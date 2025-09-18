import { createContext, useEffect, useState } from "react"
import { auth } from "../firebase/firebase.init";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const AuthContext = createContext(null);


export default function AuthProvider({children}) {


    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
    const unsubscribe = onAuthStateChanged(auth, currentUser=> {
      setUser(currentUser);
      setLoading(false);
    })
    return () => {
      return unsubscribe();
    }
  }, []) 

 

  const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

  // Logout
const logOut = () => {
  setLoading(true);
  return signOut(auth);
};


   const authInfo = {
    user,
    loading,
    logOut,
    signInUser
  }


  return (
    <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>
  )
}
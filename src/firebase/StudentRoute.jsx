import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export default function StudentRoute({children}) {
  const {user, loading} = useContext(AuthContext);
    if(loading){
        return <div className='bg-white min-h-screen flex justify-center items-center'>
            <span className="loading loading-bars loading-xl"></span>

        </div>
    }


    if(user){
        return children;
    }

  return (
     <Navigate to='/login'> </Navigate>
  )
}

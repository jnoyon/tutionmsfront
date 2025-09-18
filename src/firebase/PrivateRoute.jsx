import React, { useContext } from 'react'
import { Navigate } from 'react-router';
import { AuthContext } from './AuthProvider';

export default function PrivateRoute({children}) {

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
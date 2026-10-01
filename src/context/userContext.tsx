
import React, { useState ,createContext,useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from './authContext';
import { apiRequest, handleApiError } from '@/lib/api';
const GetUsers = createContext<any>({
  user: null,
  error: null,

  getUser: async() => {},
});
export function GetUserProvider({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<any>(null);
  const [error,setError]=useState<any>(null);
  const [products,setProducts]=useState<any>(null);
  const {session}=useSession()
  const getUser=async()=>{
    const token = await AsyncStorage.getItem('token');
    if(!token){
      setUser(null);
      return;
    }
    if(token){
      try {
        const data= await apiRequest(`/api/getUser`,{
          method:'GET',
          headers:{
            'Content-type':'application/json',
            authorization:`Bearer ${token}`}
        })
        setUser(data.user);
      } catch (error:any) {
        handleApiError(error)
      }
    }
  };
  useEffect(()=>{
    if(session){
      getUser()
    }
  },[session]);
  return (
  <GetUsers.Provider value={{user,error,getUser}}>
    {children}
  </GetUsers.Provider>
)
};
export function useUser (){
  return useContext(GetUsers);
};
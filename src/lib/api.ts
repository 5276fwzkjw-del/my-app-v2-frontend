import { Alert } from "react-native";

export class ApiError extends Error{
    status:number;
    constructor(message:string,status:number){
        super(message);
        this.name='ApiError';
        this.status=status
    }
}
const API_URL= process.env.EXPO_PUBLIC_API_URL;
export async function apiRequest(url:string,options:RequestInit={}){
        const res = await fetch(`${API_URL}${url}`,options);
        const text = await res.text();
        let data :any=[];
        try {
            data= text? JSON.parse(text):null;
            
        } catch (error) {
            data = {message:text|| 'Server returned an invalid response'}
        }
        
        if(!res.ok){
            throw new ApiError(data?.message || `Request failed with status ${res.status}`,res.status);
        }
        return data;

};
export function handleApiError(error:unknown){
    if(error instanceof ApiError){
        Alert.alert('Error',error.message);
        return
    }
    if(error instanceof Error){
        Alert.alert('Error',error.message);
        return
    }
    Alert.alert('Error: something went wrong');
}
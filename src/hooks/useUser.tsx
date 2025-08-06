import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { ApiResponse } from "../../types/ApiResponse";
import { useToast } from "./use-toast";


export interface UserDetails {
    _id: string,
    name: string,
    username: string,
    image: string,
    totalPosts: number,
    totalComments: number,
    totalSaved: number,
}
export const useGetUserByUsername = (username: string) => {
    const {toast} = useToast();
    return useQuery({
        queryKey: ['user',username],
        queryFn: async({queryKey}) => {
            const [,username] = queryKey;
            const {data: response} = await axios.get<ApiResponse<UserDetails>>(`/api/user?username=${username}`);
            if(!response.success) {
                toast({
                    title: "Failed to load user.",
                    description: response.message,
                    variant: "destructive",
                })
                return 
            }
            return response.data
        },
        enabled: !!username,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    })
}
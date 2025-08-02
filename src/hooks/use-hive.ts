import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type TopHives = {
    _id: string,
    subscriberCount: number,
    name: string,
    description: string
}

export const useGetTopHives = () => {
    return useQuery({
        queryKey: ['top-hives'],
        queryFn: async() => {
            const {data: response} = await axios.get('/api/hive/get-top-hives');
            return response.data as TopHives[];
        }
    })
}
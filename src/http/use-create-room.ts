import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateRoomRequest } from "./types/create-room-request";
import type { CreateRoomResponse } from "./types/crete-room-response";

/* useQuery é usado para listagem */
/* useMutation eh usado para criar, editar e deletar */

export function useCreateRoom () {

    const queryClient =  useQueryClient()

    return useMutation ({
        mutationFn: async (data: CreateRoomRequest) => {
            const response = await fetch('http://localhost:3333/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                 
            })
            const result:CreateRoomResponse = await response.json()
            return result
        },

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['get-rooms']})
        },
    })
}
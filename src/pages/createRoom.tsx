import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

type GetRoomsResponse = Array<{
  id: string;
  name: string;
}>;

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: ["get-rooms"] /* Identificador único da chamada HTTP */,
    queryFn: async () => {
      /* Qual função uso pra fazer a REQ */
      const response = await fetch("http://localhost:3333/rooms");
      const result: GetRoomsResponse = await response.json();
      return result;
    },
  });

  return (
  <div>
    {isLoading && <p>Carregando...</p>}
    {(
      <div className=" flex flex-col gap-1">
        {data?.map((room) => (
          <Link to={`/room/${room.id}`} key={room.id}>{room.name}</Link>
        ))}
      </div>
    )}
  </div>
);
}

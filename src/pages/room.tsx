import { Navigate, useParams } from "react-router-dom"


type RoomParams = {
  roomId: string
}

export function Room() {

  const params = useParams<RoomParams>() /* Pegar o que foi passado na rota dinamica */

if (!params.roomId) {
  return <Navigate replace to="/" /> /* Se acessar sem o id vai pra pagina principal e o replace nao deixa ele voltar pra pagina anterior */
}

  return (
    <div>
      <p>Room {params.roomId}</p>
    </div>
  )
}

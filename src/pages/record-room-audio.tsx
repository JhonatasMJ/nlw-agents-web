/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import { useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function'

type RoomParams = {
  roomId: string
}

export function RecordRoomAudio() {
  const params = useParams<RoomParams>()
  const [isRecording, setIsRecording] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<NodeJS.Timeout>(null)

  function stopRecording() {
    setIsRecording(false)

    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop()
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  async function uploadAudio(audio: Blob) {
    const formData = new FormData()

    formData.append('file', audio, 'audio.webm')

    const response = await fetch(
      `http://localhost:3333/rooms/${params.roomId}/audio`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const result = await response.json()

    console.log(result)
  }

  function createRecorder(audio: MediaStream) {
    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    })

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data)
      }
    }

    recorder.current.onstart = () => {
      console.log('Gravação iniciada!')
    }

    recorder.current.onstop = () => {
      console.log('Gravação encerrada/pausada')
    }

    recorder.current.start()
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('O seu navegador não suporta gravação')
      return
    }

    setIsRecording(true)

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    })

    createRecorder(audio)

    intervalRef.current = setInterval(() => {
      recorder.current?.stop()

      createRecorder(audio)
    }, 5000)
  }

  if (!params.roomId) {
    return <Navigate replace to="/" />
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <h1 color='text-4xl font-bold'>Gravação de áudio</h1>
      <div className='flex items-center gap-4'>
{/** biome-ignore lint/suspicious/noAssignInExpressions: <explanation> */}
<Button variant='secondary' className=' cursor-pointer' onClick={() => window.location.href = `/room/${params.roomId}`}>
  <ArrowLeft/>
  Voltar
  </Button>
      {isRecording ? (
        <Button className='cursor-pointer bg-red-500 text-white hover:bg-red-600' onClick={stopRecording}>Pausar gravação</Button>
      ) : (
        <Button className='cursor-pointer bg-orange-500 text-white hover:bg-amber-600' onClick={startRecording}>Gravar áudio</Button>
      )}
      
      </div>


    </div>
  )
}

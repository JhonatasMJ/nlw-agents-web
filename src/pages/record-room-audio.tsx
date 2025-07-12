/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'

export function RecordRoomAudio() {
  const [isRecording, setIsRecording] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)

  function stopRecording() {
    setIsRecording(false)

    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop()
    }
  }

  const isRecordingSupported =
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window.MediaRecorder === 'function'

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('Seu navegador não suporta gravação de áudio')
      return
    }

    setIsRecording(true)

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_180,
      },
    })

    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    })

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log(event.data)
      }
    }

    recorder.current.onstart = () => {
      console.log('Gravação Iniciada')
    }

    recorder.current.onstop = () => {
      console.log('Gravação Parada')
    }

    recorder.current.start()
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      {isRecording ? (
        <Button onClick={stopRecording}>Parar Gravação</Button>
      ) : (
        <Button onClick={startRecording}>Iniciar Gravação</Button>
      )}
      {isRecording ? <p>Gravando...</p> : <p>Pausado</p>}
    </div>
  )
}

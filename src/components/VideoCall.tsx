import { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'

interface Props {
  roomId: string
  isInitiator: boolean
  onEnd: () => void
}

export function VideoCall({ roomId, isInitiator, onEnd }: Props) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState('Starting...')

  useEffect(() => {
    let peer: Peer | null = null
    let localStream: MediaStream | null = null
    let interval: any = null
    let receiverInterval: any = null
    let currentCall: any = null
    let hasCalled = false

    const channel = supabase.channel(`room-${roomId}`)

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStream = stream
      if (localVideoRef.current) localVideoRef.current.srcObject = stream

      // ✅ FIXED peer init (NO redeclaration bug)
      peer = new Peer({
        host: '0.peerjs.com',
        port: 443,
        secure: true,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
              urls: 'turn:openrelay.metered.ca:80',
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
          ],
        },
      })

      peer.on('open', (myId) => {
        console.log('My ID:', myId)
        setStatus('Waiting for other person...')

        channel.subscribe((status) => {
          if (status !== 'SUBSCRIBED') return

          // ✅ SINGLE listener (no stacking)
          channel.on('broadcast', { event: 'join' }, ({ payload }) => {
            console.log('Received:', payload, 'Me:', myId)

            if (payload.id === myId) return

            // =====================
            // CALLER
            // =====================
            if (isInitiator && payload.role === 'receiver' && !hasCalled) {
              hasCalled = true
              setStatus('Calling...')

              currentCall = peer!.call(payload.id, stream)

              currentCall.on('stream', (remoteStream: MediaStream) => {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = remoteStream
                }
                setStatus('Connected! ✅')
                clearInterval(interval)
              })

              currentCall.on('error', (err: any) => {
                setStatus(`Call error`)
                console.error(err)
              })
            }

            // =====================
            // RECEIVER
            // =====================
            if (!isInitiator && payload.role === 'caller') {
              channel.send({
                type: 'broadcast',
                event: 'join',
                payload: { id: myId, role: 'receiver' },
              })
            }
          })

          // =====================
          // RETRY SIGNALING
          // =====================
          if (isInitiator) {
            interval = setInterval(() => {
              channel.send({
                type: 'broadcast',
                event: 'join',
                payload: { id: myId, role: 'caller' },
              })
            }, 2000)
          } else {
            receiverInterval = setInterval(() => {
              channel.send({
                type: 'broadcast',
                event: 'join',
                payload: { id: myId, role: 'receiver' },
              })
            }, 2000)
          }
        })
      })

      // =====================
      // ANSWER CALL
      // =====================
      peer.on('call', (call) => {
        currentCall = call
        setStatus('Answering...')

        call.answer(stream)

        call.on('stream', (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
          }
          setStatus('Connected! ✅')
          clearInterval(receiverInterval)
        })
      })

      // =====================
      // CONNECTION FAIL SAFE
      // =====================
      setTimeout(() => {
        if (!remoteVideoRef.current?.srcObject) {
          setStatus('Connection failed ❌')
        }
      }, 10000)

      peer.on('error', (err) => {
        console.log('Peer error:', err)
        setStatus(`Error`)
      })
    })

    return () => {
      clearInterval(interval)
      clearInterval(receiverInterval)

      currentCall?.close()
      peer?.destroy()

      localStream?.getTracks().forEach((t) => t.stop())

      supabase.removeChannel(channel)
    }
  }, [roomId, isInitiator])

  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-sm text-muted-foreground">Status: {status}</p>

      <div className="flex gap-4 w-full">
        <div className="relative w-1/2">
          <video ref={localVideoRef} autoPlay muted className="w-full rounded-xl border" />
          <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
            You
          </span>
        </div>

        <div className="relative w-1/2">
          <video ref={remoteVideoRef} autoPlay className="w-full rounded-xl border" />
          <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
            Peer
          </span>
        </div>
      </div>

      <Button variant="destructive" onClick={onEnd}>
        End Call
      </Button>
    </div>
  )
}
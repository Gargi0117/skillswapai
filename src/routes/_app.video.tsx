import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { VideoCall } from '@/components/VideoCall'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_app/video')({
  validateSearch: (search: Record<string, unknown>) => ({
    room: (search.room as string) || '',
    role: (search.role as 'caller' | 'receiver') || '',
  }),
  component: VideoPage,
})

function VideoPage() {
  const { room, role: urlRole } = Route.useSearch()
  const [roomId, setRoomId] = useState(room || '')
  const [role, setRole] = useState<'caller' | 'receiver' | null>(urlRole || null)
  const [inCall, setInCall] = useState(!!(room && urlRole))

  if (inCall && role) {
    return (
      <div className="p-6">
        <VideoCall
          roomId={roomId}
          isInitiator={role === 'caller'}
          onEnd={() => {
            setInCall(false)
            setRole(null)
            setRoomId('')
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-full p-6">
      <h1 className="text-2xl font-bold">Video Call</h1>

      <Input
        placeholder="Enter Room ID (e.g. gargi_anupam)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="max-w-sm"
      />

      <div className="flex gap-4">
        <Button
          disabled={!roomId}
          onClick={() => { setRole('caller'); setInCall(true) }}
        >
          Start Call (Caller)
        </Button>
        <Button
          variant="outline"
          disabled={!roomId}
          onClick={() => { setRole('receiver'); setInCall(true) }}
        >
          Join Call (Receiver)
        </Button>
      </div>
    </div>
  )
}
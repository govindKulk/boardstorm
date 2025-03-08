  "use client"

  import { storeBoardData } from '@/app/actions/db'
  import { SocketClass } from '@/app/socket'
  import BoardScreen from '@/components/boardscreen/BoardScreen'
  import { useAuth } from '@/contexts/AuthContext'
  import { CanvasData } from '@/types/types'
  import { debounce } from '@/utils/debounce'
  import { useSession } from 'next-auth/react'
  import { useParams, useSearchParams } from 'next/navigation'
  import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
  import { Socket } from 'socket.io-client'

  export default function SingleBoardPage() {





    return (
      <div

      >

          <BoardScreen />

      </div>
    )
  }




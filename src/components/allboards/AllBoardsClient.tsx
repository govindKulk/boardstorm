"use client"
import { Board } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import AllBoardsScreen from './AllBoardsScreen'
import AllBoardNavbar from './AlllBoardNavbar'
import { Skeleton } from '../ui/skeleton'

function AllBoardsClient({
    boards
}: {
    boards: Board[] | null
}) {

    if (!boards) {
        return <div>
            <AllBoardNavbar onSearch={params => { }} />
            <Skeleton
                className='h-full w-full'
            />
        </div>
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBoards, setFilteredBoards] = useState<Board[]>(boards);

    // Apply debouncing when user types
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            const filtered = boards.filter((board) =>
                board.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBoards(filtered);
        }, 300); // 300ms debounce

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery, boards]);

    return (
        <div className="min-h-screen bg-background">
            <AllBoardNavbar onSearch={setSearchQuery} />
            <AllBoardsScreen boards={filteredBoards} />
        </div>
    )
}

export default AllBoardsClient

import BoardCard from './BoardCard';
import CreateBoardCard from './CreateBoardCard';
import { Board } from '@prisma/client';

function AllBoardsScreen({
    boards
}: {
    boards: Board[] | null
}) {
  



    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Boards</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <CreateBoardCard />
                {boards && boards?.map((board) => (
                    <BoardCard key={board.id} board={board} />
                ))}
            </div>
        </main>
    )
}



export default AllBoardsScreen
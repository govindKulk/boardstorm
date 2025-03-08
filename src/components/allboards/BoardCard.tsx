import Link from "next/link"
import { Card, CardContent, CardFooter } from "../ui/card"
import Image from "next/image"
import { BsThreeDots } from "react-icons/bs"
import { Trash, TrashIcon } from "lucide-react"
import { useState } from "react"
import useOutsideClick from "@/hooks/useOutsideClick"
import { deleteBoard } from "@/app/actions/boards"
import toast from "react-hot-toast"
import { redirect } from "next/navigation"

export default function BoardCard({ board }: { board: any }) {
  const formattedDate = new Date(board.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useOutsideClick<HTMLDivElement>(() => setShowMenu(false));
  console.log(showMenu)

  const handleDelete = async () => {
  

    const { error, data } = await deleteBoard(board.id);
    if (error) {
      toast.error("Try again lateɻ");
    } else {
      toast.success("Successfully Deleted the board");
      redirect('/boards');
    }
  }
  return (



    <div className=" h-[220px] relative">
      <div

        onClick={async (e) => {
          e.stopPropagation();
          setShowMenu(prev => !prev);


        }}
        className="absolute right-2 cursor-pointer top-2 z-10 hover:text-muted-foreground/70"
      >
        <BsThreeDots size={30} />
      </div>
      <div
        ref={menuRef}
        onClick={handleDelete}
        className={` z-10 bg-white p-2 absolute rounded-lg shadow-xl right-2 top-8 mt-2  flex items-center justify-center text-red-400  ${showMenu ? 'visible' : 'invisible'} transition-all duration-300 cursor-pointer hover:bg-zinc-100/50`}
      >
        <TrashIcon size={20} />
      </div>



      <Link href={`/boards/${board.id}`} >
        <Card className="overflow-hidden relative hover:shadow-md transition-shadow h-[220px] flex flex-col" >

          <div className="relative h-36 bg-muted">
            <Image
              src={board.imageUrl || "/placeholder.svg?height=144&width=256"}
              alt={board.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4 flex-grow">
            <h3 className="font-medium truncate">{board.title}</h3>
          </CardContent>
          <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">Last edited on {formattedDate}</CardFooter>
        </Card>
      </Link>

    </div>
  )
}
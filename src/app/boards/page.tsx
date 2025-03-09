
import AllBoardNavbar from "@/components/allboards/AlllBoardNavbar"

import AllBoardsScreen from "@/components/allboards/AllBoardsScreen"
import { Board } from "@prisma/client";
import { getBoardData } from "../actions/db";
import { getBoards } from "../actions/boards";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AllBoardsClient from "@/components/allboards/AllBoardsClient";
import RenderServiceProvider from "@/contexts/RenderServiceContext";

// Dummy data based on board schema
const boards = [
  {
    id: "1",
    title: "Marketing Strategy",
    imageUrl: null,
    createdAt: new Date("2023-01-15").toISOString(),
    updatedAt: new Date("2023-03-20").toISOString(),
    orgId: "org1",
  },
  {
    id: "2",
    title: "Product Roadmap",
    imageUrl: null,
    createdAt: new Date("2023-02-10").toISOString(),
    updatedAt: new Date("2023-04-05").toISOString(),
    orgId: "org1",
  },
  {
    id: "3",
    title: "Q2 Goals",
    imageUrl: null,
    createdAt: new Date("2023-03-22").toISOString(),
    updatedAt: new Date("2023-03-22").toISOString(),
    orgId: "org2",
  },
  {
    id: "4",
    title: "Team Retrospective",
    imageUrl: null,
    createdAt: new Date("2023-04-01").toISOString(),
    updatedAt: new Date("2023-04-15").toISOString(),
    orgId: "org1",
  },
  {
    id: "5",
    title: "Design System",
    imageUrl: null,
    createdAt: new Date("2023-04-10").toISOString(),
    updatedAt: new Date("2023-04-18").toISOString(),
    orgId: "org2",
  },
]

export default async function AllBoardsPage() {

 const data = await auth();
 if(!data?.user){
  redirect('/signin')
 }

 const {error, data: boardsData} = await getBoards(data.user?.id)

 console.log(error);
 
  
  return (

      <AllBoardsClient boards={boardsData}/>


  )
}






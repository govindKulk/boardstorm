import React from 'react'
import { RiRectangleLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
import { CiText } from "react-icons/ci";
import { MdModeEditOutline } from "react-icons/md"; // pencil
import { GoHorizontalRule } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";
import { BsCursorFill } from "react-icons/bs";
import { useBoardContext } from '@/app/board/[id]/page';
import { FaRegHandSpock } from "react-icons/fa";
import { BiEraser } from 'react-icons/bi';


function ToolsBar() {


  const {activeTool, setActiveTool} = useBoardContext();
  return (
    <div
    className='flex justify-center max-sm:max-w-[400px] sm:w-[500px] mx-auto  shadow-xl px-8 rounded-xl border border-slate-400 bg-gray-100 absolute top-8 left-1/2 -translate-x-1/2 backdrop-blur-1 divide-x-2 divide-slate-300 z-10  '
    >
      {
        toolsData.map((tool, i) => {
          return (
            <div
            className={`p-4 hover:cursor-pointer ${activeTool === tool.name ? 'text-blue-500': 'text-black'}`}
            onClick={() => setActiveTool(tool.name)}
            key={tool.name}>{<tool.icon size={20} />}</div>
          )
        })
      }
    </div>

  )
}

const toolsData = [
  {
    icon: BsCursorFill,
    name: "select"
  },
  {
    icon: FaRegHandSpock,
    name: "hand"
  },
  {
    icon: RiRectangleLine,
    name: "rectangle"
  },
  {
    icon: FaRegCircle,
    name: "circle"
  },
  {
    icon: CiText,
    name: "text"
  },
  {
    icon: MdModeEditOutline,
    name: "pencil"
  },
  {
    icon: BiEraser,
    name: "eraser"
  },
  // {
  //   icon: GoHorizontalRule,
  //   name: "line"
  // },
  // {
  //   icon: FaRegStar,
  //   name: "star"
  // },
]

export default ToolsBar
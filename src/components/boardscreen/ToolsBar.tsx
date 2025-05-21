"use client"

import React, { useRef, useState } from 'react'
import { RiMenu3Fill, RiProfileFill, RiRectangleLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
import { CiMenuBurger, CiText } from "react-icons/ci";
import { MdLineStyle, MdLineWeight, MdModeEditOutline, MdShapeLine } from "react-icons/md"; // pencil
import { GoHorizontalRule } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";
import { BsCursorFill, BsLine, BsMenuButton, BsTools } from "react-icons/bs";
import { FaRegHandSpock } from "react-icons/fa";
import { BiEraser } from 'react-icons/bi';
import SingInButton from '../auth/signin-button';
import { useSidebar } from '../ui/sidebar';
import { useSession } from 'next-auth/react';
import { User2Icon } from 'lucide-react';
import { IoIosColorPalette } from "react-icons/io";
import { PiPaintBrushDuotone } from "react-icons/pi";
import { useBoardContext } from '@/contexts/BoardContext';
import useOutsideClick from '@/hooks/useOutsideClick';
import { Switch } from '../ui/switch';
import { color } from 'framer-motion';
import { UserMenu } from '../user-menu';
import { useIsMobile } from '@/hooks/use-mobile';


function ToolsBar() {


  const { activeTool, setActiveTool, color, setColor, strokeWidth, setStrokeWidth, drawMode, setDrawMode} = useBoardContext();
  const { toggleSidebar } = useSidebar();

  const { data: session } = useSession();
  const [colorPalleteActive, setColorPalleteActive] = useState(false);
  const [strokePalleteActive, setStrokePalleteActive] = useState(false);
  
  const colorPalleteRef = useOutsideClick<HTMLDivElement>(() => setColorPalleteActive(false))
  const strokePalleteRef = useOutsideClick<HTMLDivElement>(() => setStrokePalleteActive(false))

  const isMobile = useIsMobile();
  const [showMobileTools, setShowMobileTools] = useState(false);

  return (
    <div
      className="
  flex justify-between w-full items-center
  fixed top-0 md:top-4 shadow-[rgba(0px_0px_0px_0.3)_0_5_10_30] flex-col  md:flex-row
    z-10
   py-2 md:py-0
    md:px-4
   gap-2 md:gap-0
   md:py-2
    bg-muted-foreground/10
    backdrop-blur-[0.1]
   
  "
    >


    { isMobile ? <div
    className=' flex justify-between items-center px-2 w-full'
    >
      <button onClick={toggleSidebar} className='bg-slate-800 text-white dark:bg-slate-500 rounded-xl  text-center p-2  font-bold shadow-xl hover:cursor-pointer'>
        <RiMenu3Fill color={"white"} size={isMobile ? 20 : 30} />

        </button>
        <UserMenu/> 
    </div> : <button onClick={toggleSidebar} className='bg-slate-800 dark:bg-slate-500 rounded-xl  text-center p-2  font-bold shadow-xl hover:cursor-pointer'>
        <RiMenu3Fill color={"white"} size={ 30} />
      </button>}

      
     {
      isMobile ? <div
      className='flex justify-between items-center gap-2 sm:gap-4 px-2 w-full'
      >

        <span
        onClick={() => setShowMobileTools(prev => !prev)}
        className={`border-2 border-muted-foreground p-2 rounded-full flex items-center relative left-0 justify-center bg-slate-800 dark:bg-slate-500 text-white text- font-bold shadow-yellow-500 cursor-pointer  ${showMobileTools ? '' : ''}`}>
          <BsTools size={20} />
        </span>
        <div
      className ={`flex  md:justify-center  shadow-xl px-2 sm:px-4 md:px-8 rounded-xl border border-slate-400 bg-gray-100 dark:bg-slate-600   divide-x-2 divide-slate-300 z-10 ${showMobileTools ? ' opacity-100' : ' opacity-0'} transition-all duration-500 ease-out`}
    >
      {
        toolsData.map((tool, i) => {
          return (
            <div
              className={`p-2 flex items-center justify-center sm:p-4 hover:cursor-pointer ${activeTool === tool.name ? 'text-blue-500' : 'text-black dark:text-white'}`}
              onClick={() => setActiveTool(tool.name)}
              key={tool.name}>{<tool.icon size={isMobile ? 15 : 20} />}</div>
          )
        })
      }

      <div
        ref={colorPalleteRef}
        className={`p-2 sm:p-4 hover:cursor-pointer ${colorPalleteActive ? 'text-blue-500' : 'text-black dark:text-white'} relative`}
        onClick={() => setColorPalleteActive(prev => !prev)}
      >
        <IoIosColorPalette size={isMobile ? 15 :20} />
        {
          colorPalleteActive && <div
            onClick={e => e.stopPropagation()}
            className='absolute top-full left-0  p-2 bg-gray-200 transition-all duration-300 rounded-xl  shadow-md my-2 text-black flex flex-col md:flex-row gap-2 items-center'
          >
            {colors.map((colorItem, i) => (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(colorItem.hex)
                }}
                className={`bg-black ${colorItem.class} ${color === colorItem.hex ? 'border-2 border-white shadow-2xl' : ''} transition-all ease-out duration-75 min-w-4 sm:min-w-6 sm:min-h-6 lg:min-w-8 min-h-4 lg:min-h-8 block rounded-full shadow-xl `} key={i}>
              </div>
            ))}
          </div>
        }

      </div>
      <div
        ref={strokePalleteRef}
        className={`p-2 sm:p-4 hover:cursor-pointer ${strokePalleteActive ? 'text-blue-500' : 'text-black dark:text-white'} relative`}
        onClick={() => setStrokePalleteActive(prev => !prev)}
      >
        <PiPaintBrushDuotone size={isMobile ? 15 : 20} />
        {
          strokePalleteActive && <div
            onClick={e => e.stopPropagation()}
            className='absolute top-full left-0 p-2 bg-gray-200 transition-all duration-300 rounded-xl  shadow-md my-2  text-black flex flex-col md:flex-row gap-2 items-center justify-center text-center'
          >
            {
              [
                3, 6,9
              ].map((size, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    setStrokeWidth(size)
                    e.stopPropagation();
                  }}
                  className={` ${strokeWidth === size ? 'border-2  border-blue-500 shadow-2xl' : ''}  bg-gray-50 transition-all ease-out duration-75 w-4 sm:w-8  h-4 sm:h-8 flex items-center justify-center rounded-full shadow `} >
                  <GoHorizontalRule size={size*3} />
                </div>

              ))
            }

            <div
            className='flex flex-col md:flex-row gap-2 md:ml-4'
            >

              {isMobile ? <div
                className='text-nowrap capitalize text-xs'
              >
                {drawMode}
              </div> :  <div
                className='text-nowrap text-sm'
              >
                Stroke :
              </div>}
              <Switch
              checked={drawMode === 'fill'}
              onCheckedChange={() => setDrawMode(drawMode === 'stroke' ? 'fill' : 'stroke')} 
              
              />
              {!isMobile && <div
                className='text-nowrap text-sm'
              >
                : Fill
              </div>}
            </div>

          </div>
        }

      </div>


    </div>

      </div> :    <div
      className='flex  justify-center max-sm:max-w-[400px] sm:w-[500px] mx-auto  shadow-xl px-2 sm:px-4 md:px-8 rounded-xl border border-slate-400 bg-gray-100 dark:bg-slate-600   divide-x-2 divide-slate-300 z-10  '
    >
      {
        toolsData.map((tool, i) => {
          return (
            <div
              className={`p-2 flex items-center justify-center md:p-4 hover:cursor-pointer ${activeTool === tool.name ? 'text-blue-500' : 'text-black dark:text-white'}`}
              onClick={() => setActiveTool(tool.name)}
              key={tool.name}>{<tool.icon size={isMobile ? 15 : 20} />}</div>
          )
        })
      }

      <div
        ref={colorPalleteRef}
        className={`p-2 md:p-4 hover:cursor-pointer ${colorPalleteActive ? 'text-blue-500' : 'text-black dark:text-white'} relative`}
        onClick={() => setColorPalleteActive(prev => !prev)}
      >
        <IoIosColorPalette size={isMobile ? 15 :20} />
        {
          colorPalleteActive && <div
            onClick={e => e.stopPropagation()}
            className='absolute top-full left-0  p-2 bg-gray-200 transition-all duration-300 rounded-xl  shadow-md my-2 text-black flex gap-2 items-center'
          >
            {colors.map((colorItem, i) => (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(colorItem.hex)
                }}
                className={`bg-black ${colorItem.class} ${color === colorItem.hex ? 'border-2 border-white shadow-2xl' : ''} transition-all ease-out duration-75 min-w-6 lg:min-w-8 min-h-6 lg:min-h-8 block rounded-full shadow-xl `} key={i}>
              </div>
            ))}
          </div>
        }

      </div>
      <div
        ref={strokePalleteRef}
        className={`p-2 md:p-4 hover:cursor-pointer ${strokePalleteActive ? 'text-blue-500' : 'text-black dark:text-white'} relative`}
        onClick={() => setStrokePalleteActive(prev => !prev)}
      >
        <PiPaintBrushDuotone size={isMobile ? 15 : 20} />
        {
          strokePalleteActive && <div
            onClick={e => e.stopPropagation()}
            className='absolute top-full left-0 p-2 bg-gray-200 transition-all duration-300 rounded-xl  shadow-md my-2  text-black flex gap-2 items-center text-center'
          >
            {
              [
                3, 6,9
              ].map((size, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    setStrokeWidth(size)
                    e.stopPropagation();
                  }}
                  className={` ${strokeWidth === size ? 'border-2  border-blue-500 shadow-2xl' : ''}  bg-gray-50 transition-all ease-out duration-75 w-6 lg:w-8 h-6 lg:h-8 flex items-center justify-center rounded-full shadow `} >
                  <GoHorizontalRule size={size*3} />
                </div>

              ))
            }

            <div
            className='flex flex-row gap-2 ml-4'
            >

              <div
                className='text-nowrap text-sm capitalize'
              >
                {drawMode}
              </div>
              <Switch
              className='text-white'
              color='white'
              checked={drawMode === 'fill'}
              onCheckedChange={() => setDrawMode(drawMode === 'stroke' ? 'fill' : 'stroke')} 
            
              />
             
            </div>

          </div>
        }

      </div>


    </div>
     }

      {!isMobile && <UserMenu/>}
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
]

const colors = [
  { class: 'bg-red-500', hex: '#ef4444' },
  { class: 'bg-cyan-400', hex: '#22d3ee' },
  { class: 'bg-sky-500', hex: '#0ea5e9' },
  { class: 'bg-indigo-500', hex: '#6366f1' },
  { class: 'bg-fuchsia-500', hex: '#d946ef' },
  { class: 'bg-slate-600', hex: '#475569' },
  { class: 'bg-zinc-600', hex: '#52525b' }
];


export default ToolsBar
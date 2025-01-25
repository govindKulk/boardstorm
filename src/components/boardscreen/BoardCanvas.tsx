import { CircleType, RectangleType, TextType } from '@/types/shapes';
import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Rectangle from './shapes/Rectangle';
import { useBoardContext } from '@/app/board/[...id]/page';
import Circle from './shapes/Circle';
import Text from './shapes/Text';
import ShapeComponent from './shapes/Shape';
import { Vector2d } from 'konva/lib/types';





const initialRectangles: RectangleType[] = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'red',
    id: 'rect1',
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: 'green',
    id: 'rect2',
  },
];

const BoardCanvas = () => {

  const {canvasData, setCanvasData, activeTool, setActiveTool} = useBoardContext();

  

  const [rectangles, setRectangles] = React.useState<RectangleType[]>(initialRectangles);
  const [selectedId, selectShape] = React.useState<string>('');

  const addTextBox = (x: number, y: number) => {
    if(canvasData?.texts && canvasData?.texts.length > 0){
      
      setCanvasData({
  
        ...canvasData,
        texts: [
          ...canvasData?.texts,
          {
          id: `text-id-${crypto.randomUUID()}`,
          x,
          y,
          fontSize: 30,
          stroke: 'black',
          text: "Add your text"
          
          
        }]
      })
  }else{
    setCanvasData({
      
      ...canvasData,
      texts: [

        {
        id: `text-id-${crypto.randomUUID()}`,
        x,
        y,
        stroke: 'black',
        fontSize: 30,
      text: "Add your text"
        
      }]
  })
    
    }
  }

  const addCircle = (x: number, y: number) => {
    if(canvasData?.circles && canvasData?.circles.length > 0){
      
      setCanvasData({
  
        ...canvasData,
        circles: [
          ...canvasData?.circles,
          {
          id: `circle-id-${crypto.randomUUID()}`,
          x,
          y,
          stroke: 'black',
          radius: 50
    
        }]
    })
  }else{
    setCanvasData({

      ...canvasData,
      circles: [

        {
        id: `circle-id-${crypto.randomUUID()}`,
        x,
        y,
        radius: 50,
        stroke: 'black'
        
      }]
  })
    
    }
  }

  const addRectangle = (x: number, y: number) => {
    if(canvasData?.rectangles && canvasData?.rectangles.length > 0){
      
      setCanvasData({
  
        ...canvasData,
        rectangles: [
          ...canvasData?.rectangles,
          {
          id: `rect-id-${crypto.randomUUID()}`,
          x,
          y,
          width: 100,
          height: 100,
          stroke: 'black'       
    
        }]
    })
  }else{
    setCanvasData({

      ...canvasData,
      rectangles: [

        {
        id: `rect-id-${crypto.randomUUID()}`,
        x,
        y,
        width: 100,
        height: 100,
        stroke: 'black'       
  
      }]
  })
    
    }
  }

  const handleStageClick = (
    e: KonvaEventObject<MouseEvent | TouchEvent, Node<NodeConfig>>
  ) => {
    const stage = e.target.getStage();
  
    // Get pointer position relative to the transformed stage
    const pointerPosition = stage?.getPointerPosition(); // Absolute coordinates
    const transform = stage?.getAbsoluteTransform().copy(); // Copy transform matrix
    transform?.invert(); // Invert the transform to map screen space to local space
    const localPos = transform?.point(pointerPosition as Vector2d); // Transform absolute to local
  
    // Deselect shapes if clicking on an empty area
    const clickedOnEmpty = e.target === stage;
    if (clickedOnEmpty) {
      selectShape('');
    }
  
    if (localPos) {
      switch (activeTool) {
        case 'eraser':
          erase();
          break;
        case 'rectangle':
          addRectangle(localPos.x, localPos.y); // Add shape relative to the transformed coordinates
          break;
        case 'circle':
          addCircle(localPos.x, localPos.y);
          break;
        case 'text':
          addTextBox(localPos.x, localPos.y);
          break;
        default:
          break;
      }
    }

    if(activeTool !== "hand" && activeTool != "eraser"){

     setActiveTool('select'); // Reset the tool after action
    }
  
  };
  

  useEffect(() => {
    console.log(canvasData, " << canvas data")
  }, [canvasData])
  const stageRef = useRef<any>(null); // Reference to the stage
  const [scale, setScale] = useState(1); // Track zoom scale
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Track stage position

  // Handle zoom
  const handleWheel = (e: any) => {
    
    if (activeTool !== "hand") return;
    e.evt.preventDefault();
    const stage = stageRef.current;
    const scaleBy = 1.05; // Zoom factor
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    // Calculate new scale
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    // Adjust position to focus on the cursor
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  function erase() {
    if(selectedId){
      const typeInitial = selectedId.split('-')[0];
      console.log(typeInitial, "from erase func: ")
    }
  }


  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleStageClick}
      onTouchStart={handleStageClick}
      ref={stageRef}
      scaleX={scale}
      scaleY={scale}
      x={position.x}
      y={position.y}
      draggable={activeTool === "hand"}
      onWheel={handleWheel} // Zoom on wheel
    >
      <Layer>
        {canvasData?.rectangles && canvasData.rectangles.length > 0 && canvasData.rectangles.map((rect, i) => {
          return (

            <ShapeComponent
            key={rect.id}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onDelete={() => {
                let rects = canvasData.rectangles;
                rects = rects.splice(i, 1);
                setCanvasData({
                  ...canvasData,
                  ...rects
                })
              }}
              handleDragStart={() => {

                let newRectangles = rectangles;
                newRectangles.splice(i, 1);
                newRectangles = [
                  ...newRectangles,
                  rect
                ]
                setRectangles(newRectangles);
              }}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onChange={(newAttrs: RectangleType) => {
                console.log(newAttrs.width)
                const rects = canvasData?.rectangles;
                rects[i] = newAttrs;
                setCanvasData({
                  ...canvasData,
                  ...rects
                })
              }}
              Component={Rectangle}
            >
            </ShapeComponent>
          );
        })}
        {canvasData?.circles && canvasData.circles.length > 0 && canvasData.circles.map((rect, i) => {
          return (
            <ShapeComponent
            key={rect.id}
            shapeProps={rect}

            onDelete={() => {
              let circles = canvasData.circles;
              circles = circles.splice(i, 1);
              setCanvasData({
                ...canvasData,
                ...circles
              })
            }}
            isSelected={rect.id === selectedId}
            handleDragStart={() => {

              let newCircles = canvasData?.circles;
              newCircles.splice(i, 1);
              newCircles = [
                ...newCircles,
                rect
              ]
              setCanvasData({
                ...canvasData,
                circles: [
                  ...newCircles
                ]
              })
            }}
            Component={Circle}
            onSelect={() => {
              selectShape(rect.id);
            }}
            onChange={(newAttrs) => {
  
              const circles = canvasData?.circles;
              circles[i] = newAttrs as CircleType;
              setCanvasData({
                ...canvasData,
                ...circles
              })
            }}
            >
              {/* {
                   <Circle
                   key={rect.id}
                   shapeProps={rect}
                   isSelected={rect.id === selectedId}
                   handleDragStart={() => {
     
                     let newCircles = canvasData?.circles;
                     newCircles.splice(i, 1);
                     newCircles = [
                       ...newCircles,
                       rect
                     ]
                     setCanvasData({
                       ...canvasData,
                       circles: [
                         ...newCircles
                       ]
                     })
                   }}
                   onSelect={() => {
                     selectShape(rect.id);
                   }}
                   onChange={(newAttrs: CircleType) => {
         
                     const circles = canvasData?.circles;
                     circles[i] = newAttrs;
                     setCanvasData({
                       ...canvasData,
                       ...circles
                     })
                   }}
                 />
              } */}
              
            </ShapeComponent>
          );
        })}
        {canvasData?.texts && canvasData.texts.length > 0 && canvasData.texts.map((text, i) => {
          return (
            <ShapeComponent
            key={text.id}
                shapeProps={text}
                isSelected={text.id === selectedId}
                onTextChange={(val) => {
                  let texts = canvasData?.texts;
                  texts[i] = {
                    ...texts[i],
                    text: val
                  }
                  setCanvasData({
                    ...canvasData,
                    ...texts
                  })
                }}  
                handleDragStart={() => {
  
                  let texts = canvasData?.texts;
                  texts.splice(i, 1);
                  texts = [
                    ...texts,
                    text
                  ]
                  setCanvasData({
                    ...canvasData,
                    texts: [
                      ...texts
                    ]
                  })
                }}
                onSelect={() => {
                  selectShape(text.id);
                }}
                onChange={(newAttrs) => {
      
                  const texts = canvasData?.texts;
                  texts[i] = newAttrs;
                  setCanvasData({
                    ...canvasData,
                    ...texts
                  })
                }}

                onDelete={
                  () => {
                    let texts = canvasData.texts;
                    texts = texts.splice(i, 1);
                    setCanvasData({
                      ...canvasData,
                      ...texts
                    })
                  }
                }

                Component={Text}
            >
              

            </ShapeComponent>
          );
        })}


      </Layer>
    </Stage>
  );
};

 export default BoardCanvas;

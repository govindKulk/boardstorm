import { CircleType, RectangleType, Shape, TextType } from '@/types/shapes';
import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, KonvaNodeComponent, Line } from 'react-konva';
import Rectangle from './shapes/Rectangle';
import Circle from './shapes/Circle';
import Text from './shapes/Text';
import ShapeComponent from './shapes/Shape';
import { Vector2d } from 'konva/lib/types';
import { Stage as StageTypes } from 'konva/lib/Stage';
import { CanvasData } from '@/types/types';
import { useBoardContext } from '@/contexts/BoardContext';
import { useTheme } from 'next-themes';







const BoardCanvas = () => {

  const { canvasData, setCanvasData, activeTool, setActiveTool, color, strokeWidth, drawMode } = useBoardContext();




  const [selectedId, selectShape] = React.useState<string>('');
  const [isTextEditting, setIsTextEditing] = React.useState<boolean>(false);
  const [isPencilDrawing, setIsPencilDrawing] = React.useState<boolean>(false);
  const [lastLine, setLastLine] = useState<Shape | null>(null)
  const {theme} = useTheme();
  

  const addShape = (x: number, y: number, type: string) => {

    let newShape: Shape = {
      id: `${type}-id-${crypto.randomUUID()}`,
      x,
      y,
      width: 100,
      height: 100,
      radius: 50,
      fontSize: strokeWidth * 5,
      stroke: color,
      strokeWidth,
      type,
      text: "Add Your Text Here"
  
    }

    if(drawMode === 'fill' && type != 'pencil'){
      delete newShape.stroke;
      newShape.fill = color;
    }


    if(type === "text"){
      delete newShape.strokeWidth;
    }

    if(type === "circle" || type === "text"){
      delete newShape.height;
      delete newShape.width;
      
      
    }else if (type == "rectangle"){  
      delete newShape.fontSize;
      delete newShape.radius;
    }else if (type == "pencil"){
      delete newShape.fontSize;
      delete newShape.radius;
      delete newShape.height;
      delete newShape.width;
      
      newShape.x = 0
      newShape.y = 0
      
      newShape.points = [x, y]
      setLastLine(newShape);

      
    }
    if (canvasData?.shapes && canvasData?.shapes.length > 0) {


      setCanvasData({
        ...canvasData,
        shapes: [
          ...canvasData?.shapes,
          newShape
        ]

      })
    } else {
      setCanvasData({

        ...canvasData,
        shapes: [newShape]
      })

    }
  }

  function checkIfClickedOnLine(x: number, y: number) {
    const TOLERANCE = 5; // Adjust this value for sensitivity
    const lines = canvasData?.shapes.filter((shape) => shape.type === "pencil");
  
    if (!lines || lines.length === 0) {
      return {
        line: null,
        res: false,
      };
    }
  
    let selectedLine: any = null;
  
    for (const line of lines) {
      const points = line.points;
      if (!points || points.length < 4) continue; // Skip invalid lines
  
      for (let i = 0; i < points.length - 2; i += 2) {
        const x1 = points[i];
        const y1 = points[i + 1];
        const x2 = points[i + 2];
        const y2 = points[i + 3];
  
        // Check distance from the point (x, y) to the segment (x1, y1) -> (x2, y2)
        const dist = pointToSegmentDistance(x, y, x1, y1, x2, y2);
  
        if (dist <= TOLERANCE) {
          selectedLine = line;
          return {
            line: selectedLine,
            res: true,
          };
        }
      }
    }
  
    return {
      line: null,
      res: false,
    };
  }
  
  // Helper function to calculate distance from a point to a line segment
  function pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
  
    const lenSq = dx * dx + dy * dy;
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  
    t = Math.max(0, Math.min(1, t));
  
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
  
    const distX = px - closestX;
    const distY = py - closestY;
  
    return Math.sqrt(distX * distX + distY * distY);
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


    if (isTextEditting || activeTool == "hand") {
      return;
    }

    

    if (localPos) {
      switch (activeTool) {
          case 'pencil':
            setIsPencilDrawing(true);
            addShape(localPos.x, localPos.y, "pencil");
            break;
          case 'rectangle':
          addShape(localPos.x, localPos.y, "rectangle"); // Add shape relative to the transformed coordinates
          break;
          case 'circle':
          addShape(localPos.x, localPos.y, "circle"); // Add shape relative to the transformed coordinates
          break;
          case 'text':
            addShape(localPos.x, localPos.y, "text"); // Add shape relative to the transformed coordinates
            break;
          case 'eraser':
            {
              const data = checkIfClickedOnLine(localPos.x, localPos.y);
              console.log(data.line)
              if(data.res && canvasData){
                let filteredCanvas = canvasData.shapes.filter(shape => shape.id !== data.line.id);

                setCanvasData({
                  ...canvasData,
                  shapes: filteredCanvas
                })

              }
              break;
            }
          default:
            break;
      }
    }

    if (activeTool !== "hand" && activeTool != "eraser" && activeTool != "text" && activeTool != "pencil") {

      setActiveTool('select'); // Reset the tool after action
    }

  };


  useEffect(() => {
    console.log(canvasData, " << canvas data")
  }, [canvasData])
  const stageRef = useRef<any>(null); // Reference to the stage
  const [scale, setScale] = useState(canvasData?.scale || 1); // Track zoom scale
  const [position, setPosition] = useState({ x: canvasData?.position?.x || 0, y: canvasData?.position?.y || 0 }); // Track stage position

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

    setCanvasData({
      shapes: [],
      ...canvasData,
      position: {
        x: position.x,
        y: position.y
      },
      scale
    })
  };

  const getMatrixPoints = (stage: StageTypes | null) => {

    const pointerPosition = stage?.getPointerPosition(); // Absolute coordinates
    const transform = stage?.getAbsoluteTransform().copy(); // Copy transform matrix
    transform?.invert(); // Invert the transform to map screen space to local space
    const point = transform?.point(pointerPosition as Vector2d); 

    return point;
  }
  const handleStageDrag = (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => {
    if (activeTool !== "hand") return;

    const stage = e.target.getStage();
    if (!stage) return;

    const newPos = stage.position(); // Get the new position of the stage

    setPosition(newPos); // Update state

    setCanvasData({
      shapes: [],
      ...canvasData,
      position: { x: newPos.x, y: newPos.y } // Use the new position directly
    });
};


  const handleMouseMove = (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    if(activeTool === "pencil" && isPencilDrawing){
      const stage = e.target.getStage();
      const point = getMatrixPoints(stage);

      if(point){
          // add point

          let newLine = lastLine;
          if(newLine && newLine.points){
            
            setLastLine({
              ...newLine,
              points: newLine?.points.concat([point.x, point.y])
            });
          }
      }
      


      if(canvasData && lastLine?.points ){

        if(lastLine.points?.length > 2){
          let filteredShapes = canvasData.shapes.filter((shape) => shape.id != lastLine?.id)
          setCanvasData({
            ...canvasData,
            shapes: [
              ...filteredShapes,
              lastLine
              
            ]
          })
          
        }else{
          let filteredShapes = canvasData.shapes.filter((shape) => shape.id != lastLine?.id)
          setCanvasData({
            ...canvasData,
            shapes: [
              ...filteredShapes,
              
            ]
          })
          
        }

      }
    }
  }
  const handleMouseUp = (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    if(activeTool === "pencil" && isPencilDrawing){

      
      setIsPencilDrawing(false);
      setLastLine(null);
         

  }}


  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleStageClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleStageClick}
      onDragEnd={handleStageDrag}
      onDragStart={handleStageDrag}
      onDragMove={handleStageDrag}

      ref={stageRef}
      scaleX={scale}
      scaleY={scale}
      x={position.x}
      y={position.y}
      draggable={activeTool === "hand"}
      onWheel={handleWheel} // Zoom on wheel
    >
      <Layer>

        {
          canvasData?.shapes.map((shape, i) => {
            switch (shape.type) {
              case "rectangle":
                let rect = shape as RectangleType;
                return (
                  <ShapeComponent
                    key={rect.id}
                    shapeProps={rect}
                    isSelected={rect.id === selectedId}
                    onDelete={() => {
                      let shapes = canvasData?.shapes?.filter(shape => shape.id !== rect.id);


                      setCanvasData({
                        ...canvasData,
                        shapes
                      })
                    }}
                    handleDragStart={() => {

                      let shapes = canvasData?.shapes;
                      shapes.splice(i, 1);
                      shapes.push(shape);
        
                      setCanvasData({
                        ...canvasData,
                        shapes
                      });
                    }}
                    onSelect={() => {
                      selectShape(rect.id);
                    }}
                    onChange={(newAttrs: RectangleType) => {
                      console.log(newAttrs.width)
                      const shapes = canvasData?.shapes;
                      shapes[i] = newAttrs;
                      setCanvasData({
                        ...canvasData,
                        shapes
                      })
                    }}
                    Component={Rectangle}
                  >
                  </ShapeComponent>
                )
                break;
              case "circle":
                let circle = shape as CircleType;
                return (
                  <ShapeComponent
                    key={circle.id}
                    shapeProps={circle}

                    onDelete={() => {
                      let shapes = canvasData?.shapes;
                      shapes.splice(i, 1);
                      setCanvasData({
                        ...canvasData,
                        shapes
                      })
                    }}
                    isSelected={circle.id === selectedId}
                    handleDragStart={() => {

                      let shapes = canvasData?.shapes;
                      shapes.splice(i, 1);
                      shapes = [
                        ...shapes,
                        circle
                      ]
                      setCanvasData({
                        ...canvasData,
                        shapes
                      })
                    }}
                    Component={Circle}
                    onSelect={() => {
                      selectShape(circle.id);
                    }}
                    onChange={(newAttrs) => {

                      const shapes = canvasData?.shapes;
                      shapes[i] = newAttrs as CircleType;
                      setCanvasData({
                        ...canvasData,
                        shapes
                      })
                    }}
                  >


                  </ShapeComponent>
                )
                break;
              case "text":

                let text = shape as TextType;
                return (
                  <ShapeComponent
                    key={text.id}
                    shapeProps={{
                      ...text,
                    }}
                    isSelected={text.id === selectedId}
                    onTextChange={(val) => {
                      console.log("changin text.. ")
                      let shapes = canvasData.shapes;
                      shapes[i] = {
                        ...shapes[i],
                        text: val
                      }
                      setCanvasData({
                        ...canvasData,
                        shapes
                      })
                    }}

                    onEditChange={(state: boolean) => { setIsTextEditing(state) }}
                    handleDragStart={() => {

                      let shapes = canvasData?.shapes;
                      shapes.splice(i, 1);
                      shapes = [
                        ...shapes,
                        text
                      ]
                      setCanvasData({
                        ...canvasData,
                        shapes
                      })
                    }}
                    onSelect={() => {
                      selectShape(text.id);
                    }}
                    onChange={(newAttrs) => {

                      const shapes = canvasData?.shapes;
                      shapes[i] = newAttrs;
                      setCanvasData({
                        ...canvasData,
                        shapes
                      })
                    }}

                    onDelete={
                      () => {
                        let shapes = canvasData?.shapes;
                        shapes.splice(i, 1);
                        console.log(shapes)
                        setCanvasData({
                          ...canvasData,
                          shapes
                        })
                      }
                    }

                    Component={Text}
                  >


                  </ShapeComponent>
                )
                break;
              case "pencil":
                let line = shape;
                return(
                                <Line
                                  key={i}
                                  points={line.points}
                                  stroke={
                                   theme === "dark" && (line.stroke === "#475569") ? 'white' : line.stroke 
                                    }
                                  strokeWidth={line.strokeWidth}
                                  tension={0.5}
                                  lineCap="round"
                                  lineJoin="round"
                                  
                                  
                               
                                />
                )
              default:
                break;
            }
          })
        }





      </Layer>
    </Stage>
  );
};

export default BoardCanvas;

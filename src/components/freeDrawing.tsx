
import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import React, { useState } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';

enum tools { pen, eraser}

type Line = {
    tool : string,
    points: number[],
    strokeWidth: number
}
type LinesType = Line[]

const App = () => {
  const [tool, setTool] = useState<string>('pen');
  const [lines, setLines] = React.useState<LinesType>([]);
  const [isDrawing, setIsDrawing] = React.useState(false);
  let swidth = 5;
  const [strokeWidth, setStrokeWidth] = React.useState(5);
  
  const handleMouseDown = (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    setIsDrawing(true);
   
    console.log("mouse down")
    const pos = e.target?.getStage()?.getPointerPosition();
    
    //@ts-ignore
    setLines([...lines, { tool, points: [pos?.x, pos?.y], strokeWidth }]);
    
};

const handleMouseMove = (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    // no drawing - skipping
    console.log("mouse move")
    if (!isDrawing) {
        return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    
    if(point){
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);
    }
    
    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
};

const handleMouseUp = () => {
    console.log("mouse up")
    console.log(lines[lines.length - 1].points);
    setIsDrawing(false)
  };

return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 100}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {lines.map((line, i) => {
            return (
              <Line
                key={i}
                points={line.points}
                stroke={line.tool == "pen" ? "black" : "white" }
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                
                
             
              />
            )

          })}
        </Layer>
      </Stage>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>

      <input type="range" value={strokeWidth} onChange={(e) => {
        setStrokeWidth(Number(e.target.value));
      }} />
    </div>
  );
};

export default App;

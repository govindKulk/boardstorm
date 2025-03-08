import { CircleType, RectangleType, TextType } from "@/types/shapes"

import {  Circle as KonvaCircleType, CircleConfig} from 'konva/lib/shapes/Circle';
import { Transformer as TransformerType, TransformerConfig } from 'konva/lib/shapes/Transformer';
import React from "react";
import { Rect, Transformer, Circle as KonvaCircle } from "react-konva";
import { ChildShapeProps } from "./Shape";
import { useBoardContext } from "@/contexts/BoardContext";


const Circle: React.FC<ChildShapeProps<CircleType, KonvaCircleType>> = ({ shapeProps, isSelected, onSelect, onChange, handleDragStart, trRef, shapeRef}) => {


  const {activeTool} = useBoardContext();
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      console.log(shapeProps.id + "is selected")
      // @ts-ignore

      trRef.current?.nodes([shapeRef.current]);
      // @ts-ignore
      trRef.current?.getLayer().batchDraw();
      
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaCircle
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={activeTool !== "pencil"}
        onDragStart={handleDragStart}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}

        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef?.current;
          const scaleX = node?.scaleX();
          const scaleY = node?.scaleY();

          // we will reset it back
          node?.scaleX(1);
          node?.scaleY(1);
          onChange({
            ...shapeProps,
            x: node?.x() as number,
            y: node?.y() as number,
            // set minimal value
            
            width: Math.max(5, node && scaleX ? node.width() * scaleX : 1),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default Circle;
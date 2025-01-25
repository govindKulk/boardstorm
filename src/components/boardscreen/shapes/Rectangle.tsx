import { RectangleType } from "@/types/shapes"

import { Rect as RectType, RectConfig } from 'konva/lib/shapes/Rect';
import { Transformer as TransformerType, TransformerConfig } from 'konva/lib/shapes/Transformer';
import React from "react";
import { Rect, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { ChildShapeProps } from "./Shape";

interface RectangleProps {
  shapeProps: RectangleType
  isSelected: boolean
  onSelect: VoidFunction
  onChange: (shapeProps: RectangleType) => void
  handleDragStart: () => void
  onDelete: () => void
}
const Rectangle: React.FC<ChildShapeProps<RectangleType, RectType>> = ({ shapeProps, isSelected, onSelect, onChange, handleDragStart, shapeRef, trRef }) => {


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
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
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
          const node = shapeRef.current;
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
            height: Math.max(node && scaleY ? node?.height() * scaleY : 1),
          });
        }}
      />



    </React.Fragment>
  );
};

export default Rectangle;
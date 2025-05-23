import { TextType } from "@/types/shapes"

import { Text as KonvaTextType } from 'konva/lib/shapes/Text';
import { Transformer as TransformerType, TransformerConfig } from 'konva/lib/shapes/Transformer';
import React, { useState } from "react";
import { Rect, Transformer, Circle as KonvaCircle, Text as KonvaText } from "react-konva";
import { Html } from "react-konva-utils";
import { ChildShapeProps } from "./Shape";
import { Neonderthaw } from "next/font/google";
import { useBoardContext } from "@/contexts/BoardContext";
import { useTheme } from "next-themes";


const Text: React.FC<ChildShapeProps<TextType, KonvaTextType>> = ({ shapeProps, isSelected, onSelect, onChange, handleDragStart, onTextChange, shapeRef, trRef, onEditChange}) => {


  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(shapeProps?.text || '')
  const {theme} = useTheme();

  const {setActiveTool} = useBoardContext();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      console.log(shapeProps.id + "is selected")

      
      // @ts-ignore
      trRef.current?.nodes([shapeRef.current]);
      // @ts-ignore
      trRef.current?.getLayer().batchDraw();
      
    }else{
        setIsEditing(false)
        onEditChange?.(false)
        if(textValue){
          onTextChange?.(textValue)
        }
        setActiveTool("select")
      }
    }, [isSelected]);
    
  let previousHeight = 0;
  if(shapeRef?.current){
    previousHeight = shapeRef.current.height();
  }

  return (
    <React.Fragment
    >
        <Html>
        {
            isEditing && isSelected && <textarea

        
            style={{
                position: 'absolute',
                left: shapeRef.current?.x(),
                color: theme === "dark" ? 'white' : 'black',
                top: shapeRef.current?.y(),
                minWidth: shapeRef.current?.width(),
                minHeight: shapeRef.current?.height(),
                fontSize: shapeRef?.current?.fontSize(),
                fontFamily: shapeRef?.current?.fontFamily()
            }}
            onChange={(e) => {
                setTextValue(e.target.value)
                e.target.style.height = e.target.scrollHeight + 'px';
                e.target.style.width = e.target.scrollWidth + 'px';
              }}
              onKeyDown={(e) => {
                
                console.log(e.code)
                if(e.code == 'Enter'){
                    onTextChange && onTextChange(textValue)
                    setIsEditing(false);
                    onEditChange?.(false)
                    setActiveTool("select")
                }
            }}
            autoFocus={true}
            value={textValue}
     
            />
        }

        </Html>
      <KonvaText
        onDblClick={() => {
                    setActiveTool("text")
                    setIsEditing(true);
                    onEditChange && onEditChange(true)
                  }}
                  onDblTap={() => {
                    setActiveTool("text")
                    setIsEditing(true);
                    onEditChange && onEditChange(true)
        }}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        letterSpacing={shapeProps.strokeWidth ? 5: 2}
        lineHeight={1.5}
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
          if(node){
              onChange({
                ...shapeProps,
                x: node?.x() as number,
                y: node?.y() as number,
                // set minimal value
                
                width: Math.max(5, node && scaleX ? node.width() * scaleX  : 1),
                height: Math.max(5, node && scaleY ? node.height() * scaleY  : 1),
                fontSize: Math.max(15, node && scaleX && (node.height() > previousHeight + 10 || node.height() < previousHeight - 10) ? node.width() * scaleX * .1 : node.fontSize() ),
    
              });

          }
          if(node){
         previousHeight = node.height();
              
        }
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

export default Text;
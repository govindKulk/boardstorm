import { CircleType, RectangleType, TextType } from "@/types/shapes"

import { Rect as KonvaRectType, RectConfig } from 'konva/lib/shapes/Rect';
import { Circle as KonvaCircType } from "konva/lib/shapes/Circle";
import { Text as KonvaTextType } from "konva/lib/shapes/Text";
import { Transformer as TransformerType, TransformerConfig } from 'konva/lib/shapes/Transformer';
import React, { Ref } from "react";
import { Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { useBoardContext } from "@/contexts/BoardContext";

interface ShapeComponentProps<T extends RectangleType | CircleType | TextType, K extends KonvaRectType | KonvaCircType | KonvaTextType> {
    shapeProps: T
    isSelected: boolean
    onSelect: VoidFunction
    onChange: (updatedShape: T) => void
    handleDragStart: () => void
    onDelete: () => void
    Component: React.FC<ChildShapeProps<T,K>>
    onTextChange?: (val: string) => void
    onEditChange?: (editState: boolean) => void
}

export interface ChildShapeProps<T,K> { 
    shapeProps: T; 
    onChange: (updatedShape: T) => void; 
    handleDragStart: VoidFunction; 
    onSelect: VoidFunction; 
    isSelected: boolean; 
    trRef: Ref<TransformerType | null>; 
    shapeRef: React.RefObject<K | null>
    onTextChange?: (val:string) => void ,
    onEditChange?: (editState: boolean) => void
}



function ShapeComponent<T extends RectangleType | CircleType | TextType, K extends KonvaCircType | KonvaRectType | KonvaTextType>({ shapeProps, isSelected, onSelect, onChange, handleDragStart, onDelete, Component, onTextChange, onEditChange }: ShapeComponentProps<T,K>) {
    const shapeRef = React.useRef<K | null>(null);
    const trRef = React.useRef<TransformerType | null>(null);

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
        <React.Fragment
        >
            {

                <Component
                    shapeProps={shapeProps}
                    onSelect={activeTool === "eraser" ? onDelete : onSelect}
                    onChange={onChange}
                    handleDragStart={handleDragStart}
                    isSelected={activeTool === "pencil" ? false : isSelected}
                    trRef={trRef}
                    onTextChange={onTextChange}
                    shapeRef={shapeRef}
                    onEditChange={onEditChange}
                />
            }
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

            {
                isSelected && <Html>

                    <span
                        className="z-10 absolute bg-red-600 text-white font-bold text-lg rounded-full shadow-2xl p-2 aspect-square w-6 h-6 flex items-center justify-center hover:cursor-pointer"
                        onClick={onDelete}
                        style={{
                            position: 'absolute',
                            top: shapeRef.current ? (shapeRef.current.y() - 10)  : 0,
                            left: shapeRef.current ? shapeRef.current.width() + shapeRef.current.x() + 10 : 0,
                        }}
                    >X</span>
                </Html>
            }
        </React.Fragment>
    );
};

export default ShapeComponent;
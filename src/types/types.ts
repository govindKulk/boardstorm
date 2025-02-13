import { CircleType, RectangleType, Shape, TextType } from "./shapes"

import { Rect as KonvaRectType, RectConfig } from 'konva/lib/shapes/Rect';
import { Circle as KonvaCircType } from "konva/lib/shapes/Circle";
import { Text as KonvaTextType } from "konva/lib/shapes/Text";
import { Transformer as TransformerType, TransformerConfig } from 'konva/lib/shapes/Transformer';

interface ShapeComponentProps<T extends RectangleType | CircleType | TextType> {
    shapeProps: T

}



export type CanvasData = {
    shapes: Shape[],
    position?: {
        x: number,
        y: number
    },
    scale?: number
} | null






let canvasdata : CanvasData;


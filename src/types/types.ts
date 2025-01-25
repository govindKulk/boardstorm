import { CircleType, RectangleType, TextType } from "./shapes"

export type CanvasData = {
    rectangles: RectangleType[] ,
    circles: CircleType[],
    texts: TextType[]
} | null




let canvasdata : CanvasData;


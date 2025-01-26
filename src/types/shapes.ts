// export type RectangleType = {
//     x: number,
//     y: number,
//     width?: number,
//     height?: number,
//     fill: string,
//     id: string,
//     type: string
//     fontSize?: string,
//     text?: string,
//     radius?: string,
//   }
// export type CircleType = {
//     x: number,
//     y: number,
//     radius? : number,
//     width?: number,
//     height?: number,
//     fill: string,
//     id: string,
//     text?: string,
//     type: string,
//     fontSize?: string,
    
// }
// export type TextType = {
//     x: number,
//     y: number,
//     fill: string,
//     width?: number,
//     height?: number,
//     id: string,
//     fontSize?: number,
//     text?: string,
//     type: string,
//     radius?: string,
//   }



export type Shape = {

  // common to all
  
  x: number,
  y: number,
  type: string,
  id: string,
  fill?: string,
  stroke?: string,
  width?: number,
  height?: number,

  // textt types
  fontSize?: number,
  text?: string,

  // circle type
  radius?: number,

  // line types
  strokeWidth?: number
  points?: number[]
}

export type RectangleType = Shape;
export type CircleType = Shape;
export type TextType = Shape;
export type LineType = Shape;

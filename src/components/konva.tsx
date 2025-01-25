import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import { Rect as RectType, RectConfig } from 'konva/lib/shapes/Rect';
import { Transformer as TransformerType, TransformerConfig } from 'konva/lib/shapes/Transformer';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Rect, Transformer, KonvaNodeComponent } from 'react-konva';


interface RectangleProps {
  shapeProps: RectangleType
  isSelected: boolean
  onSelect: VoidFunction
  onChange: (shapeProps: RectangleType) => void
  handleDragStart: () => void
}
const Rectangle: React.FC<RectangleProps> = ({ shapeProps, isSelected, onSelect, onChange, handleDragStart }) => {
  const shapeRef = React.useRef<RectType | null>(null);
  const trRef = React.useRef<TransformerType | null> (null);

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      // @ts-ignore
      trRef.current?.nodes([shapeRef.current]);a
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

type RectangleType = {
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  id: string
}

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

const App = () => {
  const [rectangles, setRectangles] = React.useState<RectangleType[]>(initialRectangles);
  const [selectedId, selectShape] = React.useState<string>('');

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent, Node<NodeConfig>>) => {

    console.log("parent clicked");
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape('');
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {rectangles.map((rect, i) => {
          return (
            <Rectangle
              key={rect.id}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
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
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

 export default App;

import React, {Component, useState} from "react";
import Konva from "konva";
import {render} from "react-dom";
import {Stage, Layer, Group, Line, Rect} from "react-konva";

const defaultState = {
    points: [],
    curMousePos: [0, 0],
    isMouseOverStartPoint: false,
    isFinished: false
};

export const PolygonLayer = () => {
    const [points, setPoints] = useState(defaultState.points);
    const [curMousePos, setCurMousePos] = useState(defaultState.curMousePos);
    const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(defaultState.isMouseOverStartPoint);
    const [isFinished, setisFinished] = useState(defaultState.isFinished);


    const getMousePos = stage => {
        return [stage.getPointerPosition().x, stage.getPointerPosition().y];
    };

    const handleClick = event => {
        const stage = event.target.getStage();
        const mousePos = getMousePos(stage);

        if (isFinished) {
            return;
        }
        if (isMouseOverStartPoint && points.length >= 3) {
            setisFinished(true)
        } else {
            setPoints([...points, mousePos])
        }
    };

    const handleMouseMove = event => {
        const stage = event.target.getStage();
        const mousePos = getMousePos(stage);

        setCurMousePos(mousePos);
    };
    const handleMouseOverStartPoint = event => {
        if (isFinished || points.length < 3) return;
        event.target.scale({x: 2, y: 2});
        setIsMouseOverStartPoint(true)
    };

    const handleMouseOutStartPoint = event => {
        event.target.scale({x: 1, y: 1});
        setIsMouseOverStartPoint(false)
    };

    const handleDragStartPoint = event => {
        console.log("start", event);
    };

    const handleDragMovePoint = event => {
        const index = event.target.index - 1;
        console.log(event.target);
        const pos = [event.target.attrs.x, event.target.attrs.y];
        console.log("move", event);
        console.log(pos);
        setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)])
    };

    const handleDragOutPoint = event => {
        console.log("end", event);
    };

    const flattenedPoints = points
        .concat(isFinished ? [] : curMousePos)
        .reduce((a, b) => a.concat(b), []);
    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleClick}
            onMouseMove={handleMouseMove}
        >
            <Layer>
                <Line
                    points={flattenedPoints}
                    stroke="black"
                    strokeWidth={5}
                    closed={isFinished}
                    fill={'red'}
                />
                {points.map((point, index) => {
                    const width = 6;
                    const x = point[0] - width / 2;
                    const y = point[1] - width / 2;
                    const startPointAttr =
                        index === 0
                            ? {
                                hitStrokeWidth: 12,
                                onMouseOver: handleMouseOverStartPoint,
                                onMouseOut: handleMouseOutStartPoint
                            }
                            : null;
                    return (
                        <Rect
                            key={index}
                            x={x}
                            y={y}
                            width={width}
                            height={width}
                            fill="white"
                            stroke="black"
                            strokeWidth={3}
                            onDragStart={handleDragStartPoint}
                            onDragMove={handleDragMovePoint}
                            onDragEnd={handleDragOutPoint}
                            draggable
                            {...startPointAttr}
                        />
                    );
                })}
            </Layer>
        </Stage>
    );
}


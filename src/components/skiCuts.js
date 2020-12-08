import React from "react";
import {Group, Layer, Line, Stage, Star, Text} from "react-konva";

import useStore from "../store";

export const SkiCuts = ({setEditNumber}) => {
    const skiCuts = useStore(s => s.skiCuts);
    const setSkiCuts = useStore(s => s.setSkiCuts);

    return (
        <Layer>
            {skiCuts.map((skiCut, i) => {
                const line = skiCut.line;
                return <Line
                    key={i}
                    points={line.points}
                    stroke="#df4b26"
                    strokeWidth={line.strokeWidth}
                    // tension={0.5}
                    bezier
                    lineCap="round"
                    globalCompositeOperation={'source-over'}
                    onClick={(e) =>  setEditNumber(skiCut.id)}
                />
            })}
        </Layer>
    );
};

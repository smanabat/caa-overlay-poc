import React from "react";
import {Group, Layer, Line, Stage, Star, Text} from "react-konva";

import useStore from "../store";

export const SkiCuts = ({setEdit}) => {
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
                    strokeWidth={5}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation={'source-over'}
                />
            })}
        </Layer>
    );
};

import React from "react";
import {Layer, Star, Text} from "react-konva";

import useStore from "../store";

export const PointLabels = () => {
    const pointLabels = useStore(s => s.pointLabels);
    const layerRef = React.useRef(null);

    const selectedId = useStore(s => s.selectedRigionId);
    const selectRegion = useStore(s => s.selectRegion);


    return (
        <Layer ref={layerRef}>
            {pointLabels.map(pointLabel => {
                const {label: {text}} = pointLabel
                const star = pointLabel.star
                return (
                    <>
                        <Star
                            key={star.id}
                            id={star.id}
                            x={star.x}
                            y={star.y}
                            numPoints={5}
                            innerRadius={20}
                            outerRadius={40}
                            fill={star.color}
                            opacity={0.8}
                            shadowColor="black"

                        />
                        <Text text={text}
                              x={star.x + 50}
                              y={star.y - 50}
                              fontSize={200}
                              onClick={(e) => {
                                  console.log(e)
                              }}
                        />

                    </>
                )
            })}
        </Layer>
    );
};

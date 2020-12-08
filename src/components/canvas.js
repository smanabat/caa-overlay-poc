import React, {useState} from 'react';
import Konva from 'konva';
import {Stage} from 'react-konva';
import faker from 'faker'
import { v4 as uuidv4 } from 'uuid';

import Regions from './regions';
import BaseImage from './baseImage';

import useStore from '../store';
import {PointLabels} from "./pointLabels";
import {SkiCuts} from "./skiCuts";

let id = 1;

function getRelativePointerPosition(node) {
    // the function will return pointer position relative to the passed node
    const transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    const pos = node.getStage().getPointerPosition();

    // now we find relative point
    return transform.point(pos);
}

function zoomStage(stage, scaleBy) {
    const oldScale = stage.scaleX();

    const pos = {
        x: stage.width() / 2,
        y: stage.height() / 2
    };
    const mousePointTo = {
        x: pos.x / oldScale - stage.x() / oldScale,
        y: pos.y / oldScale - stage.y() / oldScale
    };

    const newScale = Math.max(0.05, oldScale * scaleBy);

    const newPos = {
        x: -(mousePointTo.x - pos.x / newScale) * newScale,
        y: -(mousePointTo.y - pos.y / newScale) * newScale
    };

    const newAttrs = limitAttributes(stage, {...newPos, scale: newScale});

    stage.to({
        x: newAttrs.x,
        y: newAttrs.y,
        scaleX: newAttrs.scale,
        scaleY: newAttrs.scale,
        duration: 0.1
    });
    stage.batchDraw();
}

function limitAttributes(stage, newAttrs) {
    const box = stage.findOne('Image').getClientRect();
    const minX = -box.width + stage.width() / 2;
    const maxX = stage.width() / 2;

    const x = Math.max(minX, Math.min(newAttrs.x, maxX));

    const minY = -box.height + stage.height() / 2;
    const maxY = stage.height() / 2;

    const y = Math.max(minY, Math.min(newAttrs.y, maxY));

    const scale = Math.max(0.05, newAttrs.scale);

    return {x, y, scale};
}

const MODES = Object.freeze({
    ADD_AVALANCHE: 'ADD_AVALANCHE',
    ADD_POINT: 'ADD_POINT',
    ADD_SKI_CUT: 'ADD_SKI_CUT'
})

export default () => {
    const stageRef = React.useRef();

    const [mode, setMode] = useState();

    const {width, height} = useStore(s => ({
        width: s.width,
        height: s.height
    }));
    const setSize = useStore(s => s.setSize);
    const scale = useStore(state => state.scale);
    const isDrawing = useStore(state => state.isDrawing);
    const toggleDrawing = useStore(state => state.toggleIsDrawing);

    const regions = useStore(state => state.regions);
    const setRegions = useStore(state => state.setRegions);

    const pointLabel = useStore(state => state.pointLabels);
    const setPointLabels = useStore(state => state.setPointLabels);

    const skiCuts = useStore(s => s.skiCuts);
    const setSkiCuts = useStore(s => s.setSkiCuts);

    const selectRegion = useStore(s => s.selectRegion);

    const [editId, setEditId] = useState('')
    const [editNumberId, setEditNumberId] = useState('')

    React.useEffect(() => {
        function checkSize() {
            const container = document.querySelector('.right-panel');
            setSize({
                width: container.offsetWidth,
                height
            });
        }

        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);


    function onStageClicked(e) {
        if (mode === MODES.ADD_AVALANCHE) {
            const clickedNotOnRegion = e.target.name() !== 'region';
            if (clickedNotOnRegion) {
                selectRegion(null);
            }
        }
    }

    const onStageMouseDown = e => {
        if (mode === MODES.ADD_AVALANCHE) {

            toggleDrawing(true);
            const point = getRelativePointerPosition(e.target.getStage());
            const region = {
                id: id++,
                color: Konva.Util.getRandomColor(),
                points: [point]
            };
            setRegions(regions.concat([region]));
        }

        if (mode === MODES.ADD_POINT) {
            const point = getRelativePointerPosition(e.target.getStage());
            const newPointLabel = {
                star: {
                    id: id++,
                    color: Konva.Util.getRandomColor(),
                    x: point.x,
                    y: point.y
                },
                label: {
                    text: faker.hacker.noun()
                }
            };
            setPointLabels(pointLabel.concat(newPointLabel))
            setMode('')
        }


        if (mode === MODES.ADD_SKI_CUT) {
            toggleDrawing()
            // const pos = e.target.getStage().getPointerPosition();
            const pos = getRelativePointerPosition(e.target.getStage());
            let newSkiCut = {id: uuidv4(), line: {points: [pos.x, pos.y], strokeWidth: 10}};
            let newSkiCuts = [...skiCuts, newSkiCut];
            setSkiCuts(newSkiCuts);
        }
    };

    function onStageMouseMove(e) {
        if (mode === MODES.ADD_AVALANCHE) {
            if (!isDrawing) {
                return;
            }
            const lastRegion = {...regions[regions.length - 1]};
            const point = getRelativePointerPosition(e.target.getStage());
            lastRegion.points = lastRegion.points.concat([point]);
            regions.splice(regions.length - 1, 1);
            setRegions(regions.concat([lastRegion]));
        }


        if (mode === MODES.ADD_SKI_CUT) {
            // no drawing - skipping
            if (!isDrawing) {
                return;
            }
            const point = getRelativePointerPosition(e.target.getStage());

            let lastSkiCut = skiCuts[skiCuts.length - 1];
            let lastLine = lastSkiCut.line;
            // add point
            lastLine.points = lastLine.points.concat([point.x, point.y]);

            // replace last
            skiCuts.splice(skiCuts.length - 1, 1, lastSkiCut);
            setSkiCuts([...skiCuts]);
        }
    }

    let onStageMouseUp = e => {
        if (!isDrawing) {
            return;
        }

        if (mode === MODES.ADD_SKI_CUT) {
            toggleDrawing()
            setMode('');
        }
        if (mode === MODES.ADD_AVALANCHE) {
            const lastRegion = regions[regions.length - 1];
            if (lastRegion.points.length < 3) {
                regions.splice(regions.length - 1, 1);
                setRegions(regions.concat());
            }
            toggleDrawing();
            setMode('');
        }
    };

    let pointLabelToEdit = pointLabel.find(x => x.star.id == editId);
    const editText = pointLabelToEdit?.label.text

    let skiCutToEdit = skiCuts.find(x => x.id == editNumberId);
    const editNumberText = skiCutToEdit?.line.strokeWidth

    const setEdit = (id) => {
        setEditId(id)
    }

    const setEditNumber = (id) => {
        setEditNumberId(id)
    }

    const changeText = (e) => {
        let pointLabelToEdit = pointLabel.find(x => x.star.id == editId);
        pointLabelToEdit.label.text = e.target.value
        let updatedLabels = [...pointLabel];
        setPointLabels(updatedLabels)
    }

    const changeNumber = (e) => {
        let skiCutToEdit = skiCuts.find(x => x.id == editNumberId);
        skiCutToEdit.line.strokeWidth = e.target.value
        let updatedSkiCuts = [...skiCuts];
        setSkiCuts(updatedSkiCuts)
    }


    return (
        <React.Fragment>
            <h1>{mode}</h1>
            <div>
                <label>Point Label: </label>
                <input type={"Text"} value={editText} onChange={changeText}/></div>
            <div>
                <label>Ski Cut Width: </label>
                <input type={"Number"} value={editNumberText} onChange={changeNumber}/></div>
            <div onClick={() => setMode(MODES.ADD_AVALANCHE)}>
                Add avalanche
            </div>
            <div onClick={() => setMode(MODES.ADD_POINT)}>
                Add point
            </div>
            <div onClick={() => setMode(MODES.ADD_SKI_CUT)}>
                Add ski cut
            </div>
            <Stage
                ref={stageRef}
                width={width}
                height={height}
                scaleX={scale}
                scaleY={scale}
                className="canvas"
                onWheel={e => {
                    e.evt.preventDefault();
                    const stage = stageRef.current;

                    const dx = -e.evt.deltaX;
                    const dy = -e.evt.deltaY;
                    const pos = limitAttributes(stage, {
                        x: stage.x() + dx,
                        y: stage.y() + dy,
                        scale: stage.scaleX()
                    });
                    stageRef.current.position(pos);
                    stageRef.current.batchDraw();
                }}
                onClick={onStageClicked}

                onMouseDown={onStageMouseDown}
                onMouseMove={onStageMouseMove}
                onMouseUp={onStageMouseUp}

                onTouchstart={onStageMouseDown}
                onTouchmove={onStageMouseMove}
                onTouchend={onStageMouseUp}
            >
                <BaseImage/>

                {/*avalanches*/}
                <Regions/>

                {/*Ski Cuts*/}
                <SkiCuts setEditNumber={setEditNumber}/>

                {/*points*/}
                <PointLabels setEdit={setEdit}/>
            </Stage>
            <div className="zoom-container">
                <button
                    onClick={() => {
                        zoomStage(stageRef.current, 1.2);
                    }}
                >
                    +
                </button>
                <button
                    onClick={() => {
                        zoomStage(stageRef.current, 0.8);
                    }}
                >
                    -
                </button>
            </div>
        </React.Fragment>
    );
};

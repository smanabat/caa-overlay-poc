import React, {useRef, useState} from "react";
import './App.css';
import {Stage, Layer, Star, Text, Image} from 'react-konva';
import {useImage} from 'use-image';
import ReactJson from "react-json-view";
import {PolygonLayer} from "./components/polygonLayer";
import imgMountain from './assets/sead-dedic-VDJ9BH4K1x4-unsplash.jpg'
import Canvas from "./components/canvas";
import {RegionsList} from "./components/regionsList";

function generateShapes() {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 180,
        isDragging: false,
    }));
}

const INITIAL_STATE = generateShapes();

const LionImage = () => {
    const [image] = useImage('https://konvajs.org/assets/lion.png');
    return <Image image={image} />;
};

class URLImage extends React.Component {
    state = {
        image: null
    };
    componentDidMount() {
        this.loadImage();
    }
    componentDidUpdate(oldProps) {
        if (oldProps.src !== this.props.src) {
            this.loadImage();
        }
    }
    componentWillUnmount() {
        this.image.removeEventListener('load', this.handleLoad);
    }
    loadImage() {
        // save to "this" to remove "load" handler on unmount
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener('load', this.handleLoad);
    }
    handleLoad = () => {
        // after setState react-konva will update canvas and redraw the layer
        // because "image" property is changed
        this.setState({
            image: this.image
        });
        // if you keep same image object during source updates
        // you will have to update layer manually:
        // this.imageNode.getLayer().batchDraw();
    };
    render() {
        return (
            <Image
                x={this.props.x}
                y={this.props.y}
                scale={{
                    x: .25,
                    y: .25
                }}
                image={this.state.image}
                ref={node => {
                    this.imageNode = node;
                }}
            />
        );
    }
}

function App() {
    const [stars, setStars] = useState(INITIAL_STATE);
    const [clicked, setClicked] = useState({});
    const [mouseMove, setMouseMove] = useState({});
    const stageRef = useRef(null)

    const handleDragStart = (e) => {
        const id = e.target.id();
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: star.id === id,
                };
            })
        );
    };
    const handleDragEnd = (e) => {
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: false,
                };
            })
        );
    }

    const handleClick = (e) => {
        setClicked(e);
    }

    const handleMouseMove = (e) => {
        setMouseMove(e);
    }

    return (
        <>
            {stageRef && stageRef.current && <ReactJson src={JSON.parse(stageRef.current.toJSON())}/>}
            <div className="left-panel">
                Brigthess
                <input
                    id="slider"
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    defaultValue="0"
                />
                <RegionsList />
            </div>
            <div className="right-panel">
                <Canvas />
            </div>
            {/*<PolygonLayer ref={stageRef}/>*/}

            {/*<Stage*/}
            {/*    onMouseDown={handleClick}*/}
            {/*    onMouseMove={handleMouseMove}*/}
            {/*    ref={stageRef} width={window.innerWidth} height={window.innerHeight}>*/}
            {/*    <Layer>*/}
            {/*        <URLImage src={imgMountain} x={150}/>*/}
            {/*    </Layer>*/}

            {/*    <Layer>*/}
            {/*        <Text text="Try to drag a star"/>*/}
            {/*        {stars.map((star) => (*/}
            {/*            <Star*/}
            {/*                key={star.id}*/}
            {/*                id={star.id}*/}
            {/*                x={star.x}*/}
            {/*                y={star.y}*/}
            {/*                numPoints={10}*/}
            {/*                innerRadius={20}*/}
            {/*                outerRadius={40}*/}
            {/*                fill="#89b717"*/}
            {/*                opacity={0.8}*/}
            {/*                draggable*/}
            {/*                rotation={star.rotation}*/}
            {/*                shadowColor="black"*/}
            {/*                shadowBlur={10}*/}
            {/*                shadowOpacity={0.6}*/}
            {/*                shadowOffsetX={star.isDragging ? 10 : 5}*/}
            {/*                shadowOffsetY={star.isDragging ? 10 : 5}*/}
            {/*                scaleX={star.isDragging ? 1.2 : 1}*/}
            {/*                scaleY={star.isDragging ? 1.2 : 1}*/}
            {/*                onDragStart={handleDragStart}*/}
            {/*                onDragEnd={handleDragEnd}*/}
            {/*            />*/}
            {/*        ))}*/}
            {/*    </Layer>*/}
            {/*</Stage>*/}
        </>
    );
}

export default App;

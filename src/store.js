import create from "zustand";
import faker from 'faker'

let defaultPointLabel = {
    "star": {
        "id": 123123,
        "color": "#4f0c2b",
        "x": 2026.7716535433067,
        "y": 1357.4326374674108
    },
    label: {
        text: faker.hacker.noun()
    }
};
const [useStore] = create(set => ({
    width: window.innerWidth,
    height: window.innerHeight,
    setSize: ({ width, height }) => set({ width, height }),

    imageWidth: 100,
    imageHeight: 100,

    setImageSize: size =>
        set(() => ({ imageWidth: size.width, imageHeight: size.height })),
    scale: 1,
    setScale: scale => set({ scale }),
    isDrawing: false,
    toggleIsDrawing: () => set(state => ({ isDrawing: !state.isDrawing })),

    regions: [],
    setRegions: regions => set(state => ({ regions })),

    pointLabels: [defaultPointLabel],
    // pointLabels: [],
    setPointLabels: pointLabels => set(state => ({ pointLabels })),

    selectedRigionId: null,
    selectRegion: selectedRigionId => set({ selectedRigionId }),

    brightness: 0,
    setBrightness: brightness => set({ brightness })
}));

export default useStore;

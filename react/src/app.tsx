import { useEffect, useRef, useState } from "react";
import { Bird } from "./components";
import * as mutableBirdModule from "./modules/bird-mutable";
import * as immutableBirdModule from "./modules/bird-immutable";
import * as curryBirdModule from "./modules/bird-curry";

const birdModuleMap = {
  mutable: mutableBirdModule,
  immutable: immutableBirdModule,
  curry: curryBirdModule,
};

const birdModule = birdModuleMap[import.meta.env.VITE_BIRD_TYPE];

const RANGE = {
  x: 640,
  y: 480,
};

const COLORS = [
  "#fca5a5",
  "#fdba74",
  "#fcd34d",
  "#fde047",
  "#bef264",
  "#86efac",
  "#6ee7b7",
  "#5eead4",
  "#67e8f9",
  "#7dd3fc",
  "#93c5fd",
  "#a5b4fc",
  "#c4b5fd",
  "#d8b4fe",
  "#f0abfc",
  "#f9a8d4",
  "#fda4af",
];

const TRACK_PER_FRAME = 60;
const TRACK_TOTAL_COUNT = 60;

const getColor = (frameCount: number) => {
  const colorIndex = Math.floor(frameCount / TRACK_PER_FRAME) % COLORS.length;
  return COLORS[colorIndex]!;
};

const getBirdCount = () => {
  const searchParams = new URLSearchParams(location.search);
  return parseInt(searchParams.get("birdCount") || "300", 10);
};

export const App = () => {
  const [birds, setBirds] = useState(
    birdModule.createRandomBirds(getBirdCount(), RANGE)
  );
  const frameCountRef = useRef(0);
  const timestampsRef = useRef<number[]>([]);

  useEffect(() => {
    const timestamps = timestampsRef.current;
    if (timestamps.length + 1 > TRACK_TOTAL_COUNT) {
      console.log(timestamps);
      return;
    }
    setBirds((birds) => {
      frameCountRef.current++;
      if (frameCountRef.current % TRACK_PER_FRAME === 0) {
        timestamps.push(performance.now());
      }
      return birdModule.update(
        birds as any,
        getColor(frameCountRef.current),
        RANGE
      );
    });
  }, [birds]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeContent: "center",
      }}
    >
      <div style={{ padding: 32, border: "1px solid #fff" }}>
        <div
          style={{
            position: "relative",
            width: RANGE.x,
            height: RANGE.y,
          }}
        >
          {birds.map((bird) => (
            <Bird key={bird.id} {...bird} />
          ))}
        </div>
      </div>
    </div>
  );
};

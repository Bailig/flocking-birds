import { Bird } from "./components";
import { createSignal, createEffect, For } from "solid-js";
import * as birdModule from "./modules/bird-mutable";

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

export const App = () => {
  const [birds, setBirds] = createSignal(
    birdModule.createRandomBirds(300, RANGE)
  );

  let frameCount = 0;
  const timestamps: number[] = [];

  createEffect(() => {
    birds();
    if (timestamps.length - 1 > TRACK_TOTAL_COUNT) {
      console.log(timestamps);
      return;
    }
    setTimeout(() => {
      setBirds((birds) => {
        frameCount++;
        if (frameCount % TRACK_PER_FRAME === 0) {
          timestamps.push(performance.now());
        }
        return birdModule.update(birds, getColor(frameCount), RANGE);
      });
    }, 0);
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        "place-content": "center",
      }}
    >
      <div style={{ padding: "32px", border: "1px solid #fff" }}>
        <div
          style={{
            position: "relative",
            width: `${RANGE.x}px`,
            height: `${RANGE.y}px`,
          }}
        >
          <For each={birds()}>{(bird) => <Bird {...bird} />}</For>
        </div>
      </div>
    </div>
  );
};

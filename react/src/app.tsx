import { useState } from "react";
import { Bird } from "./components";
import * as birdModule from "./modules/bird";

export const App = () => {
  const [bird, setBird] = useState<birdModule.Bird>({
    x: 100,
    y: 100,
    size: 10,
    rotation: 0,
    color: "#fff",
  });

  const handleMove = () => {
    setBird((bird) => {
      const { x: newX, y: newY } = birdModule.move(bird, 0);
      return { ...bird, x: newX, y: newY };
    });
  };

  return (
    <div>
      <Bird {...bird} />
      <button type="button" onClick={handleMove}>
        click
      </button>
    </div>
  );
};

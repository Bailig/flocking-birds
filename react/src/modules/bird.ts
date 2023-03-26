export type Bird = {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
};

export const move = (bird: Bird, rotate: number): Bird => {
  const rotation = bird.rotation + rotate;
  return {
    ...bird,
    rotation,
    y: bird.y - Math.cos((rotation * Math.PI) / 180) * 2,
    x: bird.x + Math.sin((rotation * Math.PI) / 180) * 2,
  };
};

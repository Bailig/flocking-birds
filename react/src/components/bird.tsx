export const calcRotation = ({ x, y }: { x: number; y: number }) => {
  const rad = Math.atan2(y, x);
  const deg = (rad * 180) / Math.PI;
  return deg + 90;
};

export type BirdProps = {
  x: number;
  y: number;
  size: number;
  color: string;
  next: {
    x: number;
    y: number;
  };
};

export const Bird = (props: BirdProps) => {
  const { x, y, size, next, color } = props;
  const rotation = calcRotation(next);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        transform: `rotate(${rotation}deg)`,
        transition: "background-color 0.5s",
      }}
    >
      <polygon points="50,0 0,100 100,100" fill={color} />
    </svg>
  );
};

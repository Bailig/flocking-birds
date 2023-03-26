export type BirdProps = {
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
};

export const Bird = (props: BirdProps) => {
  const { x, y, size, rotation, color } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <polygon points="50,0 0,100 100,100" fill={color} />
    </svg>
  );
};

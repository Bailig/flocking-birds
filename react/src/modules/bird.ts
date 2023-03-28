type Coordinates = {
  x: number;
  y: number;
};

export type Bird = Coordinates & {
  id: number;
  size: number;
  color: string;
  move: Coordinates;
};

const FRIEND_RADIUS = 60;
const CROWD_RADIUS = 20;
const ALIGN_STRENGTH = 0.03;
const SEPARATE_STRENGTH = 0.005;
const COHESION_STRENGTH = 0.001;
const SPEED = 5;

const filterBirdsInRadius = (
  bird: Bird,
  birds: Bird[],
  radius: number
): Bird[] => {
  return birds.filter((_bird) => {
    if (_bird.id === bird.id) {
      return false;
    }
    const distanceX = bird.x - _bird.x;
    const distanceY = bird.y - _bird.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    return distance < radius;
  });
};

const normalize = ({ x, y }: Coordinates): Coordinates => {
  const distance = Math.sqrt(x * x + y * y);
  if (distance === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: x / distance,
    y: y / distance,
  };
};

const align = (bird: Bird, birds: Bird[]): Bird => {
  const friends = filterBirdsInRadius(bird, birds, FRIEND_RADIUS);
  if (friends.length === 0) {
    return bird;
  }

  const averageX =
    friends.reduce((acc, f) => acc + f.move.x, 0) / friends.length;

  const averageY =
    friends.reduce((acc, f) => acc + f.move.y, 0) / friends.length;

  const desired = {
    x: averageX - bird.move.x,
    y: averageY - bird.move.y,
  };
  // const normalized = normalize({ x: averageX, y: averageY });

  return {
    ...bird,
    move: {
      x: bird.move.x + ALIGN_STRENGTH * desired.x,
      y: bird.move.y + ALIGN_STRENGTH * desired.y,
    },
  };
};

const separate = (bird: Bird, birds: Bird[]): Bird => {
  const crowded = filterBirdsInRadius(bird, birds, CROWD_RADIUS);
  if (crowded.length === 0) {
    return bird;
  }

  const move = crowded.reduce(
    (acc, c) => {
      const desired = {
        x: bird.x - c.x,
        y: bird.y - c.y,
      };
      // const normalized = normalize(desired);
      return {
        x: acc.x + desired.x,
        y: acc.y + desired.y,
      };
    },
    { x: 0, y: 0 }
  );

  return {
    ...bird,
    move: {
      x: bird.move.x + SEPARATE_STRENGTH * move.x,
      y: bird.move.y + SEPARATE_STRENGTH * move.y,
    },
  };
};

const cohesion = (bird: Bird, otherBirds: Bird[]): Bird => {
  const friends = filterBirdsInRadius(bird, otherBirds, FRIEND_RADIUS);
  if (friends.length === 0) {
    return bird;
  }
  const averageX = friends.reduce((acc, f) => acc + f.x, 0) / friends.length;
  const averageY = friends.reduce((acc, f) => acc + f.y, 0) / friends.length;
  const desired = {
    x: averageX - bird.x,
    y: averageY - bird.y,
  };
  // const normalized = normalize(desired);

  return {
    ...bird,
    move: {
      x: bird.move.x + COHESION_STRENGTH * desired.x,
      y: bird.move.y + COHESION_STRENGTH * desired.y,
    },
  };
};

const move = (bird: Bird): Bird => {
  const normalized = normalize(bird.move);

  return {
    ...bird,
    x: bird.x + normalized.x * SPEED,
    y: bird.y + normalized.y * SPEED,
    move: {
      x: normalized.x,
      y: normalized.y,
    },
  };
};

const bounce = (bird: Bird, range: Coordinates): Bird => {
  const strength = 1;
  if (bird.x < 0) {
    bird = {
      ...bird,
      move: {
        ...bird.move,
        x: bird.move.x + strength,
      },
    };
  }
  if (bird.x > range.x) {
    bird = {
      ...bird,
      move: {
        ...bird.move,
        x: bird.move.x - strength,
      },
    };
  }
  if (bird.y < 0) {
    bird = {
      ...bird,
      move: {
        ...bird.move,
        y: bird.move.y + strength,
      },
    };
  }
  if (bird.y > range.y) {
    bird = {
      ...bird,
      move: {
        ...bird.move,
        y: bird.move.y - strength,
      },
    };
  }
  return bird;
};

const changeColor = (bird: Bird, color: string): Bird => {
  return {
    ...bird,
    color,
  };
};

export const update = (
  birds: Bird[],
  color: string,
  range: { x: number; y: number }
): Bird[] => {
  return birds.map((bird) => {
    bird = align(bird, birds);
    bird = cohesion(bird, birds);
    bird = separate(bird, birds);
    bird = bounce(bird, range);
    bird = changeColor(bird, color);
    bird = move(bird);
    return bird;
  });
};

let id = 0;
export const createRandomBird = (range: Coordinates): Bird => {
  id++;
  return {
    id,
    x: Math.random() * range.x,
    y: Math.random() * range.y,
    size: 10,
    color: "#a5b4fc",
    move: {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    },
  };
};

export const createRandomBirds = (
  count: number,
  range: Coordinates
): Bird[] => {
  return Array.from({ length: count }, () => createRandomBird(range));
};

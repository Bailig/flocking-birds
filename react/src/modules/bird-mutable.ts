// this is written in a more memory efficient way
// here we only clone the bird object once, and than update it in place.

const FRIEND_RADIUS = 60;
const CROWD_RADIUS = 20;
const ALIGN_STRENGTH = 0.03;
const SEPARATE_STRENGTH = 0.005;
const COHESION_STRENGTH = 0.001;
const SPEED = 5;

type Vector = {
  x: number;
  y: number;
};

const normalize = ({ x, y }: Vector): Vector => {
  const distance = Math.sqrt(x * x + y * y);
  if (distance === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: x / distance,
    y: y / distance,
  };
};

export class Bird {
  static id = 0;
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  next: Vector;

  constructor({
    x,
    y,
    size,
    color,
    next,
  }: {
    x: number;
    y: number;
    size: number;
    color: string;
    next: Vector;
  }) {
    this.id = Bird.id++;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.next = {
      x: next.x,
      y: next.y,
    };
  }

  filterBirdsInRadius(birds: Bird[], radius: number): Bird[] {
    return birds.filter((_bird) => {
      if (_bird.id === this.id) {
        return false;
      }
      const distanceX = this.x - _bird.x;
      const distanceY = this.y - _bird.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      return distance < radius;
    });
  }

  align(birds: Bird[]): Bird {
    const friends = this.filterBirdsInRadius(birds, FRIEND_RADIUS);
    if (friends.length === 0) {
      return this;
    }

    const averageX =
      friends.reduce((acc, f) => acc + f.next.x, 0) / friends.length;

    const averageY =
      friends.reduce((acc, f) => acc + f.next.y, 0) / friends.length;

    const desired = {
      x: averageX - this.next.x,
      y: averageY - this.next.y,
    };
    this.next.x += ALIGN_STRENGTH * desired.x;
    this.next.y += ALIGN_STRENGTH * desired.y;
    return this;
  }

  separate(birds: Bird[]): Bird {
    const crowded = this.filterBirdsInRadius(birds, CROWD_RADIUS);
    if (crowded.length === 0) {
      return this;
    }

    const next = crowded.reduce(
      (acc, c) => {
        acc.x += this.x - c.x;
        acc.y += this.y - c.y;
        return acc;
      },
      { x: 0, y: 0 }
    );

    this.next.x += SEPARATE_STRENGTH * next.x;
    this.next.y += SEPARATE_STRENGTH * next.y;
    return this;
  }

  cohesion(otherBirds: Bird[]): Bird {
    const friends = this.filterBirdsInRadius(otherBirds, FRIEND_RADIUS);
    if (friends.length === 0) {
      return this;
    }
    const averageX = friends.reduce((acc, f) => acc + f.x, 0) / friends.length;
    const averageY = friends.reduce((acc, f) => acc + f.y, 0) / friends.length;

    const desired = {
      x: averageX - this.x,
      y: averageY - this.y,
    };

    this.next.x += COHESION_STRENGTH * desired.x;
    this.next.y += COHESION_STRENGTH * desired.y;
    return this;
  }

  bounce(range: { x: number; y: number }): Bird {
    const strength = 1;
    if (this.x < 0) {
      this.next.x = this.next.x + strength;
    }
    if (this.x > range.x) {
      this.next.x = this.next.x - strength;
    }
    if (this.y < 0) {
      this.next.y = this.next.y + strength;
    }
    if (this.y > range.y) {
      this.next.y = this.next.y - strength;
    }
    return this;
  }

  changeColor(color: string): Bird {
    this.color = color;
    return this;
  }

  move(): Bird {
    const normalized = normalize(this.next);

    this.x = this.x + normalized.x * SPEED;
    this.y = this.y + normalized.y * SPEED;
    this.next.x = normalized.x;
    this.next.y = normalized.y;

    return this;
  }

  clone(): Bird {
    return new Bird({
      x: this.x,
      y: this.y,
      size: this.size,
      color: this.color,
      next: {
        x: this.next.x,
        y: this.next.y,
      },
    });
  }
}

export const update = (
  birds: Bird[],
  color: string,
  range: { x: number; y: number }
): Bird[] => {
  return birds.map((bird) => {
    return bird
      .clone()
      .align(birds)
      .cohesion(birds)
      .separate(birds)
      .bounce(range)
      .changeColor(color)
      .move();
  });
};

export const createRandomBird = (range: { x: number; y: number }): Bird => {
  return new Bird({
    x: Math.random() * range.x,
    y: Math.random() * range.y,
    size: 10,
    color: "#a5b4fc",
    next: {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    },
  });
};

export const createRandomBirds = (
  count: number,
  range: { x: number; y: number }
): Bird[] => {
  return Array.from({ length: count }, () => createRandomBird(range));
};

export function getRandomNumber(min: number, max: number, digits = 0): number {
  return Number((Math.random() * (max - min) + min).toFixed(digits));
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomItem<T>(items: readonly T[]): T {
  return items[getRandomNumber(0, items.length - 1)];
}

export function getRandomItems<T>(items: readonly T[], count = getRandomNumber(1, items.length)): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getRandomNumber(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

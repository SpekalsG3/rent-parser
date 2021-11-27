// Range = [min; max]
export function mathRandom (min: number, max: number): number {
  if (min === max) return min
  if (min > max) {
    const _min = min
    min = max
    max = _min
  }
  return Math.floor(Math.random() * (max - min) + min)
}

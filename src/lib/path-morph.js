import { MorphSVGPlugin } from "./gsap";

const NUMBER_PATTERN = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;

/**
 * @param {number} value
 * @param {number} precision
 */
function roundNumber(value, precision) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/** @param {string} path */
function extractNumbers(path) {
  return (path.match(NUMBER_PATTERN) || []).map(Number);
}

/**
 * @param {string} fromPath
 * @param {string} toPath
 * @param {number} [precision=4]
 * @returns {(progress: number) => string}
 */
export function createPathInterpolator(fromPath, toPath, precision = 4) {
  const [normalizedFrom, normalizedTo] = MorphSVGPlugin.normalizeStrings(
    fromPath,
    toPath,
    {
      map: "complexity",
    },
  );
  const startNumbers = extractNumbers(normalizedFrom);
  const endNumbers = extractNumbers(normalizedTo);

  return (progress) => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    let index = 0;

    return normalizedFrom.replace(NUMBER_PATTERN, () => {
      const start = startNumbers[index];
      const end = endNumbers[index];
      index += 1;
      return String(
        roundNumber(start + (end - start) * clampedProgress, precision),
      );
    });
  };
}

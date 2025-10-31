// utils/detectorSimulator.ts
function stringHash(str: string) {
  let hash = 5381;
  let i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}

export function fakeDetectFromUri(uri: string) {
  const seed = stringHash(uri);
  let s = seed >>> 0;
  const rng = () => {
    s = Math.imul(s ^ (s << 13), 0x5bd1e995);
    s ^= s >>> 15;
    return (s >>> 0) / 4294967296;
  };
  const p = rng();
  let label: "unknown" | "nsfw" | "sexting" | "grooming";
  if (p < 0.72) label = "unknown";
  else if (p < 0.88) label = "nsfw";
  else if (p < 0.96) label = "sexting";
  else label = "grooming";

  const skinScore = Math.min(1, 0.05 + rng() * 0.9);
  const faceScore = Math.min(1, rng() * 0.8);
  const poseScore = Math.min(1, rng() * 0.8);

  let risk = 0.2 * skinScore + 0.4 * faceScore + 0.4 * poseScore;
  if (label === "nsfw") risk = Math.max(risk, 0.6 + rng() * 0.35);
  if (label === "sexting") risk = Math.max(risk, 0.4 + rng() * 0.45);
  if (label === "grooming") risk = Math.max(risk, 0.7 + rng() * 0.25);
  risk = Math.round(risk * 100) / 100;

  const explanation =
    label === "unknown"
      ? "No concerning features detected."
      : label === "nsfw"
      ? "High skin exposure and suggestive pose detected (simulated)."
      : label === "sexting"
      ? "Close-up intimate context detected (simulated)."
      : "Composition suggests potential grooming cues (simulated).";

  return {
    label,
    risk,
    explanation,
    hotspots: [],
    breakdown: { skinScore, faceScore, poseScore },
  };
}

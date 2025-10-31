// utils/demoImages.ts
export const DEMO_IMAGES = {
  clean: ["https://placekitten.com/600/400", "https://placebear.com/640/480"],
  lowRisk: [
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=800&q=80",
  ],
  mediumRisk: [
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80",
  ],
  highRisk: [
    // Use a non-explicit realistic screenshot hosted by you; for demo we use placeholder
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
  ],
};

// helper to pick one deterministically by group + index
export function pickDemoImage(group: keyof typeof DEMO_IMAGES, idx = 0) {
  const arr = DEMO_IMAGES[group] ?? DEMO_IMAGES.clean;
  return arr[idx % arr.length];
}

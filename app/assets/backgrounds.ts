export type BackgroundMediaType = "image" | "video";

export type BackgroundManifestEntry = {
  id: string;
  label: string;
  type: BackgroundMediaType;
  src: string;
  poster?: string;
};

// To add a new background:
// 1) Drop your media into public/images/backgrounds/ (images) or public/images/backgrounds/videos/ (videos)
// 2) Append an entry below with id, label, type, src (and poster for videos if available)
export const BACKGROUND_MANIFEST: BackgroundManifestEntry[] = [
  {
    id: "Celestial Tower",
    label: "Celestial Tower (Animated)",
    type: "video",
    src: "/images/backgrounds/videos/Celestial Tower.webm",
    poster: "images/backgrounds/Celestial Tower.png",
  },
  {
    id: "Distortion World",
    label: "Distortion World (Animated)",
    type: "video",
    src: "/images/backgrounds/videos/Distortion World.webm",
    poster: "images/backgrounds/Distortion World.png",
  },
  {
    id: "Dragons Den",
    label: "Dragons Den (Animated)",
    type: "video",
    src: "/images/backgrounds/videos/Dragons Den.webm",
    poster: "images/backgrounds/Dragons Den.png",
  },
  {
    id: "Route 3 Unova",
    label: "Route 3 Unova (Animated)",
    type: "video",
    src: "/images/backgrounds/videos/Route 3 Unova.webm",
    poster: "images/backgrounds/Route 3 Unova.png",
  },
  {
    id: "Whirl Islands",
    label: "Whirl Islands (Animated)",
    type: "video",
    src: "/images/backgrounds/videos/Whirl Islands.webm",
    poster: "images/backgrounds/Whirl Islands.png",
  },
];



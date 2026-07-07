/**
 * Theme Preset Library — 185 curated premium worship presentation themes
 * spanning 37 specific categories. Bundles backgrounds, typography, and logo configs.
 */
import type { BackgroundConfig, SectionStyle, BackgroundAnimation } from "@/lib/broadcast";
import type { LogoSettings } from "@/stores/logo.store";

export type TemplateCategory =
  | "Classic Church"
  | "Modern Worship"
  | "Minimal Clean"
  | "Elegant Scripture"
  | "Dark Stage"
  | "Light Stage"
  | "Golden Glory"
  | "Heaven Light"
  | "Cinematic"
  | "Prayer Night"
  | "Revival Fire"
  | "Holy Spirit"
  | "Cross Focus"
  | "Nature Worship"
  | "Mountain Prayer"
  | "Ocean Grace"
  | "Royal Purple"
  | "Luxury Gold"
  | "Glass Morphism"
  | "Neon Worship"
  | "Modern LED Wall"
  | "Conference Style"
  | "Youth Meeting"
  | "Christmas"
  | "Easter"
  | "Good Friday"
  | "Harvest Festival"
  | "Thanksgiving"
  | "Children Service"
  | "Wedding Service"
  | "Funeral Service"
  | "Special Meeting"
  | "Outdoor Crusade"
  | "Bible Study"
  | "Night Prayer"
  | "Sunday Service"
  | "Animated Motion Themes";

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  text: Partial<SectionStyle>;
  perGroup?: Partial<Record<"reference" | "tamil" | "english", Partial<SectionStyle>>>;
  background: Partial<BackgroundConfig>;
  logo?: { enabled: boolean; settings?: Partial<LogoSettings> };
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Classic Church",
  "Modern Worship",
  "Minimal Clean",
  "Elegant Scripture",
  "Dark Stage",
  "Light Stage",
  "Golden Glory",
  "Heaven Light",
  "Cinematic",
  "Prayer Night",
  "Revival Fire",
  "Holy Spirit",
  "Cross Focus",
  "Nature Worship",
  "Mountain Prayer",
  "Ocean Grace",
  "Royal Purple",
  "Luxury Gold",
  "Glass Morphism",
  "Neon Worship",
  "Modern LED Wall",
  "Conference Style",
  "Youth Meeting",
  "Christmas",
  "Easter",
  "Good Friday",
  "Harvest Festival",
  "Thanksgiving",
  "Children Service",
  "Wedding Service",
  "Funeral Service",
  "Special Meeting",
  "Outdoor Crusade",
  "Bible Study",
  "Night Prayer",
  "Sunday Service",
  "Animated Motion Themes",
];

// ───────── Builder helpers ─────────
const shadowSoft = { shadow: true, shadowColor: "#000000", shadowBlur: 25 };
const shadowDeep = { shadow: true, shadowColor: "#000000", shadowBlur: 40 };
const T = (text: Partial<SectionStyle>): Partial<SectionStyle> => ({
  align: "center", vAlign: "middle", lineHeight: 1.35, ...shadowSoft, ...text,
});

interface BuildOpts {
  id: string; name: string; category: TemplateCategory; description?: string;
  bg: string; gradient?: string; animation?: BackgroundAnimation;
  color?: string; refColor?: string;
  fontEn?: string; fontTa?: string; weight?: number;
  shadow?: "soft" | "deep" | "none";
  tamilSize?: number;
  logo?: TemplatePreset["logo"];
}

const build = (o: BuildOpts): TemplatePreset => {
  const fontEn = o.fontEn ?? "Inter";
  const fontTa = o.fontTa ?? "Latha";
  const color = o.color ?? "#ffffff";
  const sh = o.shadow === "none" ? { shadow: false, shadowBlur: 0 }
    : o.shadow === "deep" ? shadowDeep : shadowSoft;
  return {
    id: o.id, name: o.name, category: o.category,
    description: o.description ?? `${o.name} — worship preset.`,
    text: { ...T({ fontFamily: fontEn, color, fontWeight: o.weight ?? 500 }), ...sh },
    perGroup: {
      reference: o.refColor ? { color: o.refColor } : undefined,
      tamil: { fontFamily: fontTa, fontSizeVw: o.tamilSize ?? 5.2 },
      english: { fontFamily: fontEn },
    },
    background: {
      kind: "color", color: o.bg,
      gradient: o.gradient ?? null,
      animation: o.animation ?? "none",
    },
    logo: o.logo,
  };
};

interface ThemeDef {
  id?: string;
  name: string;
  category: TemplateCategory;
  description: string;
  bg: string;
  gradient?: string;
  animation?: BackgroundAnimation;
  color?: string;
  refColor?: string;
  fontEn?: string;
  fontTa?: string;
  weight?: number;
  shadow?: "soft" | "deep" | "none";
  logo?: TemplatePreset["logo"];
}

const themeDefs: ThemeDef[] = [
  // === Classic Church (5) ===
  { id: "cw-navy", name: "Classic Navy", category: "Classic Church", bg: "#0b1d3a", fontEn: "Georgia", fontTa: "Latha", refColor: "#93c5fd", description: "White serif on deep navy. Timeless look." },
  { name: "Classic Burgundy", category: "Classic Church", bg: "#4a0e1a", color: "#fdf6e3", fontEn: "Georgia", fontTa: "Noto Serif Tamil", description: "Ivory serif on burgundy. Traditional." },
  { name: "Classic Emerald", category: "Classic Church", bg: "#064e3b", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", description: "Gold-tinted serif on emerald." },
  { name: "Velvet Hymn", category: "Classic Church", bg: "#3f0610", gradient: "linear-gradient(135deg,#3f0610,#7f1d1d)", color: "#fde68a", fontEn: "Georgia", description: "Hymnbook velvet with gold serif." },
  { name: "Classic Ivory", category: "Classic Church", bg: "#fdf6e3", color: "#1f2937", fontEn: "Georgia", fontTa: "Noto Serif Tamil", shadow: "none", description: "Dark serif on warm ivory." },

  // === Modern Worship (5) ===
  { id: "mw-indigo", name: "Modern Indigo", category: "Modern Worship", bg: "#1e1b4b", gradient: "linear-gradient(135deg,#1e1b4b,#4338ca 50%,#7c3aed)", fontTa: "Catamaran", description: "Indigo→violet gradient." },
  { name: "Modern Slate", category: "Modern Worship", bg: "#0f172a", fontTa: "Mukta Malar", description: "Crisp sans on charcoal slate." },
  { name: "Aqua Glow", category: "Modern Worship", bg: "#0f3a44", gradient: "radial-gradient(circle at 50% 40%,#0e7490,#082f49 80%)", animation: "soft-glow", fontTa: "Mukta Malar", description: "Teal with pulsing glow." },
  { name: "Rose Modern", category: "Modern Worship", bg: "#831843", gradient: "linear-gradient(135deg,#500724,#9d174d)", fontTa: "Catamaran", description: "Rose gradient." },
  { name: "Skyline", category: "Modern Worship", bg: "#0c4a6e", gradient: "linear-gradient(180deg,#0c4a6e,#1e3a8a)", fontTa: "Mukta Malar", description: "Layered skyline blue." },

  // === Minimal Clean (5) ===
  { id: "mn-dark", name: "Minimal Dark", category: "Minimal Clean", bg: "#000000", weight: 300, shadow: "none", description: "Pure black, thin sans." },
  { name: "Minimal Light", category: "Minimal Clean", bg: "#fdf6e3", color: "#1f2937", weight: 400, shadow: "none", description: "Warm off-white, dark ink." },
  { name: "Minimal Charcoal", category: "Minimal Clean", bg: "#1c1917", color: "#f5f5f4", weight: 400, shadow: "none", description: "Editorial charcoal." },
  { name: "Minimal Slate", category: "Minimal Clean", bg: "#1e293b", weight: 400, shadow: "none", description: "Minimal slate." },
  { name: "Minimal Warm", category: "Minimal Clean", bg: "#292524", color: "#fef3c7", weight: 400, shadow: "none", description: "Warm minimal." },

  // === Elegant Scripture (5) ===
  { name: "Parchment Page", category: "Elegant Scripture", bg: "#fdf6e3", color: "#1c1917", fontEn: "Georgia", fontTa: "Noto Serif Tamil", shadow: "none", description: "Cream parchment, dark ink." },
  { name: "Study Blue", category: "Elegant Scripture", bg: "#0c2340", refColor: "#93c5fd", fontEn: "Georgia", fontTa: "Noto Serif Tamil", description: "Calm study blue." },
  { name: "Resurrection Dawn", category: "Elegant Scripture", bg: "#7c2d12", gradient: "linear-gradient(180deg,#7c2d12,#fb923c 60%,#fde68a)", color: "#fff7ed", fontEn: "Georgia", fontTa: "Noto Serif Tamil", description: "Dawn of resurrection." },
  { name: "Quiet Cream", category: "Elegant Scripture", bg: "#f5efe0", color: "#1c1917", fontEn: "Georgia", fontTa: "Noto Serif Tamil", shadow: "none", description: "Soft cream." },
  { name: "Altar Scripture", category: "Elegant Scripture", bg: "#0f0f17", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", animation: "candle-glow", description: "Hushed altar tones." },

  // === Dark Stage (5) ===
  { name: "Onyx Black", category: "Dark Stage", bg: "#000000", description: "Pure black canvas." },
  { name: "Midnight Indigo", category: "Dark Stage", bg: "#0a0e2c", description: "Midnight indigo deep tone." },
  { name: "Warm Charcoal", category: "Dark Stage", bg: "#1c1917", color: "#f5f5f4", description: "Warm charcoal backdrop." },
  { name: "Ember Fire", category: "Dark Stage", bg: "#450a0a", gradient: "radial-gradient(circle at 50% 100%,#dc2626,#450a0a 70%)", animation: "fire-glow", weight: 700, fontTa: "Catamaran", description: "Ember red with rising sparks." },
  { name: "Forest Dark", category: "Dark Stage", bg: "#022c22", animation: "stage-lights", description: "Deep forest stage look." },

  // === Light Stage (5) ===
  { name: "Soft White", category: "Light Stage", bg: "#fafaf9", color: "#1c1917", shadow: "none", fontEn: "Inter", fontTa: "Noto Sans Tamil", description: "Soft white, dark text." },
  { name: "Sunrise Light", category: "Light Stage", bg: "#fff7ed", gradient: "linear-gradient(180deg,#fff7ed,#fed7aa)", color: "#7c2d12", shadow: "none", description: "Pastel dawn light." },
  { name: "Sky Light", category: "Light Stage", bg: "#f0f9ff", gradient: "linear-gradient(180deg,#e0f2fe,#bae6fd)", color: "#0c4a6e", shadow: "none", description: "Bright clear sky." },
  { name: "Mint Light", category: "Light Stage", bg: "#f0fdf4", color: "#14532d", shadow: "none", description: "Fresh mint stage look." },
  { name: "Lavender Light", category: "Light Stage", bg: "#faf5ff", color: "#4c1d95", shadow: "none", description: "Lavender light backdrop." },

  // === Golden Glory (5) ===
  { id: "rv-glory", name: "Glory Rays", category: "Golden Glory", bg: "#78350f", gradient: "radial-gradient(circle at 50% 50%,#d97706,#78350f 60%,#1c1006)", animation: "light-rays", fontEn: "Georgia", fontTa: "Noto Serif Tamil", weight: 600, color: "#fffbeb", description: "Golden glory rays." },
  { name: "Golden Outpouring", category: "Golden Glory", bg: "#1e1b4b", animation: "golden-particles", fontEn: "Georgia", fontTa: "Noto Serif Tamil", color: "#fef3c7", description: "Golden particles outpouring." },
  { name: "Golden Sunshine", category: "Golden Glory", bg: "#d97706", gradient: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#ffffff", description: "Rich gold sunshine look." },
  { name: "Altar Gold", category: "Golden Glory", bg: "#2a1b02", gradient: "radial-gradient(ellipse at 50% 50%,#d97706,#1e1201 80%)", color: "#fef3c7", animation: "light-rays", description: "Gold rays on deep amber." },
  { name: "Crown Glory", category: "Golden Glory", bg: "#0f172a", color: "#fcd34d", animation: "sparkles", description: "Royal crown sparkles." },

  // === Heaven Light (5) ===
  { name: "Heavenly Clouds", category: "Heaven Light", bg: "#0c4a6e", gradient: "linear-gradient(180deg,#bae6fd,#0c4a6e)", color: "#ffffff", animation: "clouds", description: "Drifting sky clouds." },
  { name: "Angelic Glow", category: "Heaven Light", bg: "#f0f9ff", gradient: "radial-gradient(circle at 50% 50%,#ffffff,#e0f2fe 80%)", color: "#0369a1", shadow: "none", animation: "soft-glow", description: "Pulsing soft light." },
  { name: "Eternal Grace", category: "Heaven Light", bg: "#0284c7", color: "#ffffff", animation: "soft-glow", description: "Eternal blue glow." },
  { name: "Morning Star", category: "Heaven Light", bg: "#0891b2", gradient: "linear-gradient(135deg,#06b6d4,#0891b2)", color: "#ffffff", animation: "clouds", description: "Morning star light." },
  { name: "Sky Gates", category: "Heaven Light", bg: "#025a7d", gradient: "linear-gradient(180deg,#7dd3fc,#025a7d)", color: "#ffffff", animation: "light-rays", description: "Rays from sky gates." },

  // === Cinematic (5) ===
  { name: "Epic Widescreen", category: "Cinematic", bg: "#000000", fontEn: "Georgia", weight: 600, color: "#ffffff", shadow: "deep", description: "Widescreen dramatic look." },
  { name: "Cinematic Drama", category: "Cinematic", bg: "#0b0f19", gradient: "radial-gradient(circle at 50% 50%,#1e293b,#0b0f19)", color: "#ffffff", animation: "stage-lights", description: "Dramatic stage lighting." },
  { name: "Cinematic Stars", category: "Cinematic", bg: "#05050a", color: "#ffffff", animation: "star-field", description: "Deep cinematic space look." },
  { name: "Cinematic Fog", category: "Cinematic", bg: "#000000", color: "#ffffff", animation: "fog", description: "Moody cinematic fog." },
  { name: "Cinematic Sunset", category: "Cinematic", bg: "#451a03", gradient: "linear-gradient(135deg,#7c2d12,#451a03)", color: "#ffffff", animation: "soft-glow", description: "Warm twilight glow." },

  // === Prayer Night (5) ===
  { id: "pr-candle", name: "Candlelight Prayer", category: "Prayer Night", bg: "#1a0f08", gradient: "radial-gradient(circle at 50% 70%,#3a1e0a,#0a0604 80%)", animation: "candle-glow", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", description: "Flickering candle warmth." },
  { name: "Altar Hush Night", category: "Prayer Night", bg: "#080710", color: "#fef3c7", animation: "candle-glow", description: "Hushed prayer night look." },
  { name: "Midnight Vigil", category: "Prayer Night", bg: "#090514", color: "#ffffff", animation: "candle-glow", description: "Vigil watch candlelight." },
  { name: "Sanctuary Warmth", category: "Prayer Night", bg: "#111111", color: "#ffedd5", animation: "candle-glow", description: "Solitary candle look." },
  { name: "Quiet Spirit Night", category: "Prayer Night", bg: "#0c0721", color: "#ffffff", animation: "fog", description: "Quiet nightly prayer." },

  // === Revival Fire (5) ===
  { name: "Revival Blaze", category: "Revival Fire", bg: "#450a0a", gradient: "linear-gradient(135deg,#7f1d1d,#450a0a)", color: "#ffffff", animation: "fire-glow", description: "Roaring revival blaze." },
  { name: "Ember Sparks", category: "Revival Fire", bg: "#111827", color: "#f87171", animation: "fire-glow", description: "Rising fiery sparks." },
  { name: "Holy Fire Revival", category: "Revival Fire", bg: "#7c2d12", gradient: "linear-gradient(180deg,#c2410c,#7c2d12)", color: "#ffffff", animation: "fire-glow", description: "Deep cleansing fire." },
  { name: "Refining Furnace", category: "Revival Fire", bg: "#000000", gradient: "radial-gradient(circle at 50% 100%,#ef4444,#000000 80%)", color: "#ffffff", animation: "fire-glow", description: "Refining gold furnace." },
  { name: "Fiery Torch", category: "Revival Fire", bg: "#991b1b", color: "#ffffff", animation: "fire-glow", description: "Torchlight revival fire." },

  // === Holy Spirit (5) ===
  { name: "Spirit Dove Light", category: "Holy Spirit", bg: "#f1f5f9", gradient: "radial-gradient(circle at 50% 50%,#ffffff,#cbd5e1 80%)", color: "#334155", shadow: "none", animation: "soft-glow", description: "Gentle dove light." },
  { name: "Spirit Wind Breath", category: "Holy Spirit", bg: "#0f172a", color: "#22d3ee", animation: "fog", description: "Misty wind of the Spirit." },
  { name: "Anointing Oil Spirit", category: "Holy Spirit", bg: "#1e1b4b", color: "#fcd34d", animation: "golden-particles", description: "Flowing golden anointing oil." },
  { name: "Living Water Spirit", category: "Holy Spirit", bg: "#0c2340", color: "#ffffff", animation: "water", description: "Spring of living water." },
  { name: "Holy Breath Spirit", category: "Holy Spirit", bg: "#334155", color: "#ffffff", animation: "clouds", description: "Soft wind of grace." },

  // === Cross Focus (5) ===
  { name: "Solemn Cross Shadow", category: "Cross Focus", bg: "#000000", color: "#ffffff", shadow: "deep", animation: "floating-cross", description: "Crucifixion shadow look." },
  { name: "Calvary Cross Hope", category: "Cross Focus", bg: "#0a0e2c", color: "#fbcfe8", animation: "floating-cross", description: "Redemption rays at Calvary." },
  { name: "Victory Cross Crown", category: "Cross Focus", bg: "#2e1065", color: "#fef3c7", animation: "floating-cross", description: "Victory of the cross." },
  { name: "Redemption Cross Blood", category: "Cross Focus", bg: "#450a0a", color: "#ffffff", animation: "floating-cross", description: "Sacrificial blood cross." },
  { name: "Wooden Cross Calm", category: "Cross Focus", bg: "#1c0d02", color: "#fef3c7", animation: "floating-cross", description: "Simple wooden cross." },

  // === Nature Worship (5) ===
  { name: "Forest Sanctuary", category: "Nature Worship", bg: "#064e3b", color: "#ffffff", animation: "floating-dust", description: "Quiet forest backdrop." },
  { name: "Autumn Leaves Grace", category: "Nature Worship", bg: "#451a03", color: "#fbbf24", animation: "floating-dust", description: "Warm falling leaves." },
  { name: "Spring Meadow", category: "Nature Worship", bg: "#14532d", gradient: "linear-gradient(135deg,#15803d,#14532d)", color: "#ffffff", animation: "floating-dust", description: "Meadow green look." },
  { name: "Earthly Peace", category: "Nature Worship", bg: "#1c1917", color: "#ffffff", animation: "floating-dust", description: "Calming brown clay." },
  { name: "Valley Hills", category: "Nature Worship", bg: "#3f6212", color: "#ffffff", animation: "floating-dust", description: "Worship in the hills." },

  // === Mountain Prayer (5) ===
  { name: "Mountain Peak Silent", category: "Mountain Prayer", bg: "#0f172a", color: "#ffffff", animation: "fog", description: "Solitary mountain summit." },
  { name: "Prayer Mist Valley", category: "Mountain Prayer", bg: "#1e293b", color: "#ffffff", animation: "fog", description: "Misty mountain valleys." },
  { name: "Silent Hills Grace", category: "Mountain Prayer", bg: "#1c1917", color: "#e7e5e4", animation: "fog", description: "Hills in silent meditation." },
  { name: "Summit Highs", category: "Mountain Prayer", bg: "#334155", color: "#ffffff", animation: "fog", description: "Peak top morning mist." },
  { name: "Highlands Mist", category: "Mountain Prayer", bg: "#020617", color: "#ffffff", animation: "fog", description: "Misty highlands look." },

  // === Ocean Grace (5) ===
  { name: "Ocean Tide Wave", category: "Ocean Grace", bg: "#082f49", color: "#e0f2fe", animation: "ocean", description: "Calm ocean tide." },
  { name: "Abyssal Grace Deep", category: "Ocean Grace", bg: "#031b2e", color: "#ffffff", animation: "ocean", description: "Deep blue sea grace." },
  { name: "Shores Sanctuary", category: "Ocean Grace", bg: "#0f3a44", color: "#ffffff", animation: "ocean", description: "Calming ocean shores." },
  { name: "Grace Current Ocean", category: "Ocean Grace", bg: "#0c4a6e", gradient: "linear-gradient(180deg,#0c4a6e,#0284c7)", color: "#ffffff", animation: "ocean", description: "Strong grace currents." },
  { name: "Wave Crest", category: "Ocean Grace", bg: "#042f2e", color: "#ffffff", animation: "ocean", description: "Emerald water wave crest." },

  // === Royal Purple (5) ===
  { name: "Royal Majesty Crown", category: "Royal Purple", bg: "#3b0764", color: "#fcd34d", animation: "sparkles", description: "Majestic purple kingly theme." },
  { name: "King Purple Court", category: "Royal Purple", bg: "#4a044e", gradient: "linear-gradient(135deg,#4a044e,#701a75)", color: "#ffffff", animation: "sparkles", description: "Courtly royal purple." },
  { name: "Violet Glow Divine", category: "Royal Purple", bg: "#581c87", color: "#ffffff", animation: "soft-glow", description: "Violet glow of majesty." },
  { name: "Palace Chamber", category: "Royal Purple", bg: "#2e1065", color: "#fef3c7", animation: "sparkles", description: "Royal palace chamber." },
  { name: "Imperial Veil", category: "Royal Purple", bg: "#3b0764", color: "#ffffff", animation: "sparkles", description: "Imperial purple theme." },

  // === Luxury Gold (5) ===
  { name: "Gilded Black Royal", category: "Luxury Gold", bg: "#000000", color: "#fcd34d", shadow: "deep", animation: "golden-particles", description: "Rich gold on onyx black." },
  { name: "Gold Dust Altar", category: "Luxury Gold", bg: "#1c1201", color: "#fef3c7", animation: "golden-particles", description: "Warm gold particles." },
  { name: "Onyx Gold Luxury", category: "Luxury Gold", bg: "#111111", color: "#fbbf24", animation: "golden-particles", description: "Modern black-gold look." },
  { name: "Diamond Sparkle", category: "Luxury Gold", bg: "#000000", color: "#ffffff", animation: "sparkles", description: "Glistening diamond sparkles." },
  { name: "Palace Gold Room", category: "Luxury Gold", bg: "#292524", color: "#fbbf24", animation: "golden-particles", description: "Royal gold accents." },

  // === Glass Morphism (5) ===
  { name: "Frosted Glass Panel", category: "Glass Morphism", bg: "#1e293b", color: "#ffffff", animation: "soft-glow", description: "Soft frosted glass look." },
  { name: "Acrylic Panel Slate", category: "Glass Morphism", bg: "#0f172a", gradient: "radial-gradient(circle at 30% 30%,rgba(100,116,139,0.3) 0,transparent 70%)", color: "#ffffff", description: "High-end glass slate." },
  { name: "Pastel Glass Morph", category: "Glass Morphism", bg: "#2e1065", color: "#ffffff", animation: "abstract-worship", description: "Colorful glass pastel." },
  { name: "Aurora Glass Panel", category: "Glass Morphism", bg: "#1e1b4b", color: "#ffffff", animation: "aurora", description: "Vibrant aurora glass look." },
  { name: "Emerald Glass Panel", category: "Glass Morphism", bg: "#042f2e", color: "#ffffff", animation: "soft-glow", description: "Polished emerald glass panel." },

  // === Neon Worship (5) ===
  { name: "Neon Rose Glow", category: "Neon Worship", bg: "#000000", color: "#f43f5e", shadow: "none", description: "Glowing neon pink." },
  { name: "Neon Cyan Wave", category: "Neon Worship", bg: "#000000", color: "#06b6d4", shadow: "none", description: "Glowing neon cyan." },
  { name: "Neon Lime Light", category: "Neon Worship", bg: "#000000", color: "#84cc16", shadow: "none", description: "Glowing neon lime." },
  { name: "Neon Violet Flame", category: "Neon Worship", bg: "#000000", color: "#a855f7", shadow: "none", description: "Glowing neon purple." },
  { name: "Neon Amber Glow", category: "Neon Worship", bg: "#000000", color: "#f59e0b", shadow: "none", description: "Glowing neon gold." },

  // === Modern LED Wall (5) ===
  { name: "LED Pixel Grid", category: "Modern LED Wall", bg: "#080808", color: "#ffffff", animation: "star-field", description: "Clean pixelated background." },
  { name: "LED Wall Spotlight", category: "Modern LED Wall", bg: "#0b0f19", color: "#ffffff", animation: "stage-lights", description: "High-contrast LED look." },
  { name: "LED Aurora Screen", category: "Modern LED Wall", bg: "#030712", color: "#ffffff", animation: "aurora", description: "Dynamic LED aurora wall." },
  { name: "Matrix Wave Screen", category: "Modern LED Wall", bg: "#022c22", color: "#34d399", animation: "star-field", description: "Green matrix style." },
  { name: "LED Lens Flare", category: "Modern LED Wall", bg: "#000000", color: "#ffffff", animation: "stage-lights", description: "High brightness LED wall flare." },

  // === Conference Style (5) ===
  { id: "cs-navy-pro", name: "Conference Navy Pro", category: "Conference Style", bg: "#0c1c33", fontTa: "Catamaran", weight: 600, description: "Professional navy style.", logo: { enabled: true, settings: { position: "top-right", widthPct: 8 } } },
  { name: "Broadcast Pro Live", category: "Conference Style", bg: "#000000", fontTa: "Catamaran", weight: 500, description: "Broadcast-ready theme.", logo: { enabled: true, settings: { position: "bottom-right", widthPct: 7 } } },
  { name: "Keynote Charcoal Dark", category: "Conference Style", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 50%,#262626,#0a0a0a 80%)", fontTa: "Catamaran", description: "Keynote presentation slate." },
  { name: "Summit Indigo Live", category: "Conference Style", bg: "#1e1b4b", fontTa: "Catamaran", weight: 600, description: "Indigo summit style." },
  { name: "Press Room Light", category: "Conference Style", bg: "#111827", animation: "stage-lights", fontTa: "Catamaran", description: "Press stage stage lighting." },

  // === Youth Meeting (5) ===
  { id: "ys-violet", name: "Electric Violet Youth", category: "Youth Meeting", bg: "#3b0764", gradient: "linear-gradient(135deg,#3b0764,#7e22ce 50%,#ec4899)", fontTa: "Catamaran", weight: 700, description: "Vibrant violet youth look." },
  { name: "Neon Mint Youth", category: "Youth Meeting", bg: "#022c22", gradient: "linear-gradient(135deg,#022c22,#064e3b)", animation: "sparkles", color: "#a7f3d0", fontTa: "Catamaran", weight: 700, description: "Mint sparkles youth meeting." },
  { name: "Sunset Blaze Youth", category: "Youth Meeting", bg: "#7c2d12", gradient: "linear-gradient(135deg,#7c2d12,#ea580c 50%,#db2777)", fontTa: "Catamaran", weight: 700, description: "Orange to purple gradient." },
  { name: "Rainbow Youth Joy", category: "Youth Meeting", bg: "#0ea5e9", gradient: "linear-gradient(135deg,#fbbf24,#22c55e,#0ea5e9,#a855f7)", color: "#ffffff", weight: 800, fontTa: "Catamaran", description: "Vibrant rainbow youth style." },
  { name: "Sky Fun Youth", category: "Youth Meeting", bg: "#38bdf8", gradient: "linear-gradient(180deg,#bae6fd,#38bdf8)", color: "#0c4a6e", shadow: "none", weight: 800, fontTa: "Catamaran", description: "Cheerful sky layout." },

  // === Christmas (5) ===
  { name: "Crimson Carols Noel", category: "Christmas", bg: "#7f1d1d", color: "#fef3c7", animation: "sparkles", description: "Warm Christmas crimson." },
  { name: "Evergreen Noel", category: "Christmas", bg: "#064e3b", color: "#fde68a", animation: "sparkles", description: "Holiday evergreen green." },
  { name: "Winter Snow Noel", category: "Christmas", bg: "#0f172a", color: "#ffffff", animation: "sparkles", description: "Soft falling snow." },
  { name: "Nativity Star", category: "Christmas", bg: "#0b0e26", color: "#fcd34d", animation: "star-field", description: "Star of Bethlehem night." },
  { name: "Manger Dawn Noel", category: "Christmas", bg: "#292524", color: "#fef3c7", animation: "candle-glow", description: "Warm nativity candlelight." },

  // === Easter (5) ===
  { name: "Easter Dawn Sunrise", category: "Easter", bg: "#7c2d12", gradient: "linear-gradient(180deg,#7c2d12,#ea580c 50%,#fef08a)", color: "#ffffff", animation: "sunrise", description: "Resurrection sunrise." },
  { name: "Resurrection Light Gold", category: "Easter", bg: "#3b0764", color: "#fbbf24", animation: "light-rays", description: "Gold rays of victory." },
  { name: "Empty Tomb Solace", category: "Easter", bg: "#1e293b", color: "#fed7aa", animation: "sunrise", description: "Empty tomb resurrection dawn." },
  { name: "Easter Spring Meadow", category: "Easter", bg: "#166534", color: "#ffffff", animation: "floating-dust", description: "Spring life easter green." },
  { name: "Triumphant King Purple", category: "Easter", bg: "#4c1d95", color: "#ffffff", animation: "golden-particles", description: "Triumphant king easter purple." },

  // === Good Friday (5) ===
  { name: "Crucifixion Shadow Black", category: "Good Friday", bg: "#000000", color: "#ffffff", shadow: "deep", animation: "floating-cross", description: "Crucifixion shadow style." },
  { name: "Precious Blood Altar", category: "Good Friday", bg: "#000000", gradient: "radial-gradient(circle at 50% 50%,#450a0a,#000000 80%)", color: "#fca5a5", animation: "floating-cross", description: "Atoning blood altar look." },
  { name: "Torn Veil Solace", category: "Good Friday", bg: "#1c1917", color: "#ffffff", animation: "fog", description: "Torn temple veil look." },
  { name: "Cross Calvary Shadow", category: "Good Friday", bg: "#0a0a0a", color: "#ffffff", animation: "floating-cross", description: "Calvary shadow cross look." },
  { name: "Atonement Sacrifice", category: "Good Friday", bg: "#3b0303", color: "#ffffff", animation: "candle-glow", description: "Atoning sacrifice good friday look." },

  // === Harvest Festival (5) ===
  { name: "Golden Fields Harvest", category: "Harvest Festival", bg: "#78350f", gradient: "linear-gradient(135deg,#78350f,#d97706,#fbbf24)", color: "#fffbeb", animation: "floating-dust", description: "Golden autumn fields." },
  { name: "Harvest Abundance Gold", category: "Harvest Festival", bg: "#7c2d12", color: "#fcd34d", animation: "golden-particles", description: "Festival harvest gold." },
  { name: "Reaper Song Page", category: "Harvest Festival", bg: "#854d0e", color: "#ffffff", description: "Festival reaper song look." },
  { name: "Golden Sheaves Grain", category: "Harvest Festival", bg: "#b45309", color: "#ffffff", animation: "floating-dust", description: "Grain sheaves harvest look." },
  { name: "Divine Providence Harvest", category: "Harvest Festival", bg: "#292524", color: "#fbbf24", animation: "golden-particles", description: "Providence harvest gold." },

  // === Thanksgiving (5) ===
  { name: "Thanksgiving Grace Orange", category: "Thanksgiving", bg: "#7c2d12", gradient: "linear-gradient(135deg,#9a3412,#7c2d12)", color: "#ffffff", animation: "floating-dust", description: "Warm thanksgiving look." },
  { name: "Heart of Praise Thanksgiving", category: "Thanksgiving", bg: "#451a03", color: "#fbbf24", animation: "golden-particles", description: "Praise thanksgiving gold." },
  { name: "Gratitude Praise Page", category: "Thanksgiving", bg: "#b45309", color: "#ffffff", description: "Gratitude thanksgiving look." },
  { name: "Doxology Thanksgiving", category: "Thanksgiving", bg: "#4c0519", color: "#fde68a", description: "Doxology thanksgiving look." },
  { name: "Countless Blessings Grace", category: "Thanksgiving", bg: "#064e3b", color: "#fbbf24", animation: "floating-dust", description: "Blessings thanksgiving green." },

  // === Children Service (5) ===
  { name: "Cheerful Sky Kids", category: "Children Service", bg: "#38bdf8", gradient: "linear-gradient(180deg,#bae6fd,#38bdf8)", color: "#0c4a6e", shadow: "none", weight: 800, description: "Cheerful kids sky layout." },
  { name: "Sunshine Kids Garden", category: "Children Service", bg: "#fbbf24", color: "#451a03", shadow: "none", weight: 800, description: "Sunshine kids garden look." },
  { name: "Eden Kids Garden", category: "Children Service", bg: "#22c55e", color: "#ffffff", weight: 800, animation: "sparkles", description: "Eden kids sparkles look." },
  { name: "Kids Starfield Dream", category: "Children Service", bg: "#6b21a8", color: "#ffffff", weight: 800, animation: "sparkles", description: "Kids starfield sparkles look." },
  { name: "Kids Candy Land", category: "Children Service", bg: "#ec4899", color: "#ffffff", weight: 800, animation: "sparkles", description: "Kids candy land sparkles look." },

  // === Wedding Service (5) ===
  { name: "Rose Gold Covenant", category: "Wedding Service", bg: "#9d174d", gradient: "linear-gradient(135deg,#831843,#db2777,#fbcfe8)", color: "#ffffff", animation: "sparkles", description: "Covenant rose gold wedding." },
  { name: "Wedding Ivory Lace", category: "Wedding Service", bg: "#fdf6e3", color: "#b45309", shadow: "none", description: "Soft wedding ivory." },
  { name: "White Pearl Wedding", category: "Wedding Service", bg: "#f8fafc", color: "#334155", shadow: "none", animation: "soft-glow", description: "Soft wedding white pearl." },
  { name: "Covenant Love Burgundy", category: "Wedding Service", bg: "#4a0e1a", color: "#fef3c7", animation: "sparkles", description: "Burgundy covenant wedding." },
  { name: "Wedding Candlelight", category: "Wedding Service", bg: "#0f0d0e", color: "#fcd34d", animation: "candle-glow", description: "Candlelight covenant wedding." },

  // === Funeral Service (5) ===
  { name: "Silent Peace Rest", category: "Funeral Service", bg: "#1c1917", color: "#ffffff", shadow: "none", description: "Solace funeral silent peace." },
  { name: "Eternal Rest Sanctuary", category: "Funeral Service", bg: "#0f172a", color: "#ffffff", shadow: "none", animation: "candle-glow", description: "Solace funeral candlelight." },
  { name: "solace Solace Gray", category: "Funeral Service", bg: "#e2e8f0", color: "#1e293b", shadow: "none", description: "Solace funeral quiet gray." },
  { name: "Blessed Hope Light", category: "Funeral Service", bg: "#000000", color: "#ffffff", animation: "floating-cross", description: "Cross funeral blessed hope." },
  { name: "Abide Vigil Candle", category: "Funeral Service", bg: "#030712", color: "#ffedd5", animation: "candle-glow", description: "Candlelight funeral vigil." },

  // === Special Meeting (5) ===
  { name: "Special Scripture Spot", category: "Special Meeting", bg: "#000000", gradient: "radial-gradient(ellipse at 50% 50%,#1f2937,#000000 80%)", color: "#ffffff", animation: "stage-lights", description: "Special stage spotlight look." },
  { name: "Special Crusade Rally", category: "Special Meeting", bg: "#0c0a0f", color: "#ffffff", animation: "stage-lights", description: "Special stage crusade look.", logo: { enabled: true, settings: { position: "top-right", widthPct: 8 } } },
  { name: "Special Global Live", category: "Special Meeting", bg: "#000000", color: "#ffffff", weight: 600, description: "Special global broadcast look.", logo: { enabled: true, settings: { position: "bottom-right", widthPct: 7 } } },
  { name: "Special Revival Blaze", category: "Special Meeting", bg: "#580505", color: "#ffffff", animation: "fire-glow", description: "Special revival blaze look." },
  { name: "Special Convention Stage", category: "Special Meeting", bg: "#111827", color: "#ffffff", animation: "stage-lights", description: "Special convention stage look." },

  // === Outdoor Crusade (5) ===
  { name: "Crusade High Yellow", category: "Outdoor Crusade", bg: "#000000", color: "#fef08a", weight: 800, shadow: "none", description: "Crusade high visibility yellow." },
  { name: "Crusade High White", category: "Outdoor Crusade", bg: "#000000", color: "#ffffff", weight: 800, shadow: "none", description: "Crusade high visibility white." },
  { name: "Crusade Daylight Out", category: "Outdoor Crusade", bg: "#ffffff", color: "#000000", weight: 800, shadow: "none", description: "Crusade high visibility daylight." },
  { name: "Crusade Stadium Gold", category: "Outdoor Crusade", bg: "#0b0f19", color: "#fbbf24", weight: 700, description: "Crusade gold stadium look." },
  { name: "Crusade Open Air", category: "Outdoor Crusade", bg: "#000000", color: "#22d3ee", weight: 700, description: "Crusade open air field look." },

  // === Bible Study (5) ===
  { id: "bs-scholar", name: "Scholar Dark Page", category: "Bible Study", bg: "#000000", color: "#fcd34d", refColor: "#fcd34d", description: "Scholar dark gold page." },
  { name: "Parchment Study Page", category: "Bible Study", bg: "#fdf6e3", color: "#1c1917", shadow: "none", description: "Parchment warm study page." },
  { name: "Quiet Study Green", category: "Bible Study", bg: "#064e3b", color: "#ffffff", refColor: "#cbd5e1", description: "Study green sanctuary page." },
  { name: "Classic Study Blue Page", category: "Bible Study", bg: "#0c2340", color: "#ffffff", refColor: "#93c5fd", description: "Study blue classic page." },
  { name: "Study Daylight Page", category: "Bible Study", bg: "#f8fafc", color: "#0f172a", shadow: "none", description: "Study daylight white page." },

  // === Night Prayer (5) ===
  { name: "Night Vigil Watch", category: "Night Prayer", bg: "#030712", color: "#fed7aa", animation: "candle-glow", description: "Night watch vigil candlelight." },
  { name: "Night Devotion Candle", category: "Night Prayer", bg: "#000000", color: "#ffffff", animation: "candle-glow", description: "Night devotion candlelight." },
  { name: "Night Fog Silent", category: "Night Prayer", bg: "#050510", color: "#ffffff", animation: "fog", description: "Night fog silent devotion." },
  { name: "Night Star Sparkle", category: "Night Prayer", bg: "#120524", color: "#fcd34d", animation: "sparkles", description: "Night sparkle glorious theme." },
  { name: "Night Solace Abide", category: "Night Prayer", bg: "#18181b", color: "#ffedd5", animation: "candle-glow", description: "Night solace abide candlelight." },

  // === Sunday Service (5) ===
  { name: "Sunday Morning Calm", category: "Sunday Service", bg: "#0c4a6e", gradient: "linear-gradient(135deg,#0c4a6e,#0284c7)", color: "#ffffff", description: "Sunday morning calm blue." },
  { name: "Sunday Hymnal Green", category: "Sunday Service", bg: "#14532d", color: "#ffffff", description: "Sunday green hymnal look." },
  { name: "Sunday Celebrate Gold", category: "Sunday Service", bg: "#4c1d95", color: "#ffffff", animation: "golden-particles", description: "Sunday gold celebration." },
  { name: "Sunday Evening Glow", category: "Sunday Service", bg: "#4c0519", color: "#ffedd5", description: "Sunday evening warm burgundy." },
  { name: "Sunday Liturgy Page", category: "Sunday Service", bg: "#f5efe0", color: "#171717", shadow: "none", description: "Sunday warm liturgy page." },

  // === Animated Motion Themes (5) ===
  { id: "an-clouds", name: "Moving Clouds Motion", category: "Animated Motion Themes", bg: "#0c4a6e", color: "#ffffff", animation: "clouds", description: "Clouds animated motion." },
  { name: "Aurora Flow Motion", category: "Animated Motion Themes", bg: "#0a0e2c", color: "#ffffff", animation: "aurora", description: "Aurora animated motion." },
  { name: "Living Water Wave", category: "Animated Motion Themes", bg: "#082f49", color: "#ffffff", animation: "water", description: "Water animated motion." },
  { name: "Ocean Wave Tide", category: "Animated Motion Themes", bg: "#042f2e", color: "#ffffff", animation: "ocean", description: "Ocean animated motion." },
  { name: "Ember Glow Blaze", category: "Animated Motion Themes", bg: "#171717", color: "#fb923c", animation: "fire-glow", description: "Fire animated motion." },
];

function categoryPrefix(cat: TemplateCategory): string {
  switch (cat) {
    case "Classic Church": return "cc";
    case "Modern Worship": return "mw";
    case "Minimal Clean": return "mc";
    case "Elegant Scripture": return "es";
    case "Dark Stage": return "ds";
    case "Light Stage": return "ls";
    case "Golden Glory": return "gg";
    case "Heaven Light": return "hl";
    case "Cinematic": return "cn";
    case "Prayer Night": return "pn";
    case "Revival Fire": return "rf";
    case "Holy Spirit": return "hs";
    case "Cross Focus": return "cf";
    case "Nature Worship": return "nw";
    case "Mountain Prayer": return "mp";
    case "Ocean Grace": return "og";
    case "Royal Purple": return "rp";
    case "Luxury Gold": return "lg";
    case "Glass Morphism": return "gm";
    case "Neon Worship": return "ne";
    case "Modern LED Wall": return "ml";
    case "Conference Style": return "cs";
    case "Youth Meeting": return "ym";
    case "Christmas": return "xm";
    case "Easter": return "ea";
    case "Good Friday": return "gf";
    case "Harvest Festival": return "hf";
    case "Thanksgiving": return "tg";
    case "Children Service": return "ch";
    case "Wedding Service": return "wd";
    case "Funeral Service": return "fn";
    case "Special Meeting": return "sm";
    case "Outdoor Crusade": return "oc";
    case "Bible Study": return "bs";
    case "Night Prayer": return "np";
    case "Sunday Service": return "ss";
    case "Animated Motion Themes": return "am";
    default: return "th";
  }
}

// Generate the 185 unique presets
const counters: Record<string, number> = {};

export const TEMPLATE_PRESETS: TemplatePreset[] = themeDefs.map((def) => {
  const prefix = categoryPrefix(def.category);
  if (counters[prefix] === undefined) {
    counters[prefix] = 1;
  } else {
    counters[prefix]++;
  }
  const generatedId = def.id ?? `${prefix}-${counters[prefix]}`;

  return build({
    id: generatedId,
    name: def.name,
    category: def.category,
    description: def.description,
    bg: def.bg,
    gradient: def.gradient,
    animation: def.animation,
    color: def.color,
    refColor: def.refColor,
    fontEn: def.fontEn,
    fontTa: def.fontTa,
    weight: def.weight,
    shadow: def.shadow,
    logo: def.logo,
  });
});

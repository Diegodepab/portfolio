export interface Palette {
  name: string;
  sprite: string;
  favorite?: boolean;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    surfaceTint?: string;
  };
}

const PAGE_BACKGROUND = '#0a0f1c';

const relativeLuminance = (hex: string): number => {
  const channels = hex.match(/[\da-f]{2}/gi);
  if (!channels || channels.length !== 3) return 1;
  const [red, green, blue] = channels
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const contrastRatio = (foreground: string, background = PAGE_BACKGROUND): number => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
};

/** Lighten palette accents only as much as needed for WCAG AA body text. */
export const ensureAccessibleAccent = (color: string, minimumRatio = 4.5): string => {
  if (!/^#[\da-f]{6}$/i.test(color) || contrastRatio(color) >= minimumRatio) return color;

  const channels = color.match(/[\da-f]{2}/gi)!.map((channel) => Number.parseInt(channel, 16));
  for (let whiteMix = 0.02; whiteMix <= 1; whiteMix += 0.02) {
    const candidate = `#${channels
      .map((channel) => Math.round(channel + (255 - channel) * whiteMix).toString(16).padStart(2, '0'))
      .join('')}`;
    if (contrastRatio(candidate) >= minimumRatio) return candidate;
  }
  return '#ffffff';
};

export const pokePalettes: Palette[] = [
  {
    name: 'Gengar',
    sprite: '/pokemon/gengar.png',
    favorite: true,
    colors: { primary: '#9473b4', secondary: '#5a4a9c', tertiary: '#b48bbd', surfaceTint: 'color-mix(in srgb, #9473b4 12%, #111827)' },
  },
  {
    name: 'Bulbasaur',
    sprite: '/pokemon/bulbasaur.png',
    favorite: true,
    colors: { primary: '#399494', secondary: '#62d5b4', tertiary: '#73ac31', surfaceTint: 'color-mix(in srgb, #399494 12%, #111827)' },
  },
  {
    name: 'Gardevoir',
    sprite: '/pokemon/gardevoir.png',
    favorite: true,
    colors: { primary: '#eeeeff', secondary: '#cdcde6', tertiary: '#8be68b', surfaceTint: 'color-mix(in srgb, #8be68b 12%, #111827)' },
  },
  {
    name: 'Gyarados',
    sprite: '/pokemon/gyarados.png',
    favorite: true,
    colors: { primary: '#41b4ee', secondary: '#208bac', tertiary: '#ccb47f', surfaceTint: 'color-mix(in srgb, #41b4ee 12%, #111827)' },
  },
  {
    name: 'Charmander',
    sprite: '/pokemon/charmander.png',
    colors: { primary: '#ff9d55', secondary: '#c7682f', tertiary: '#ffc69c', surfaceTint: 'color-mix(in srgb, #ff9d55 12%, #111827)' },
  },
  {
    name: 'Squirtle',
    sprite: '/pokemon/squirtle.png',
    colors: { primary: '#67d5ec', secondary: '#348ca1', tertiary: '#a7e7f4', surfaceTint: 'color-mix(in srgb, #67d5ec 12%, #111827)' },
  },
  {
    name: 'Mudkip',
    sprite: '/pokemon/mudkip.png',
    favorite: true,
    colors: { primary: '#41a4de', secondary: '#7bcdee', tertiary: '#fbad4f', surfaceTint: 'color-mix(in srgb, #41a4de 12%, #111827)' },
  },
  {
    name: 'Dragonite',
    sprite: '/pokemon/dragonite.png',
    favorite: true,
    colors: { primary: '#ee9c39', secondary: '#de7339', tertiary: '#38a27c', surfaceTint: 'color-mix(in srgb, #ee9c39 12%, #111827)' },
  },
  {
    name: 'Pikachu',
    sprite: '/pokemon/pikachu.png',
    favorite: true,
    colors: { primary: '#f6e652', secondary: '#f6bd20', tertiary: '#9c5200', surfaceTint: 'color-mix(in srgb, #f6e652 12%, #111827)' },
  },
  {
    name: 'Mewtwo',
    sprite: '/pokemon/mewtwo.png',
    colors: { primary: '#e38aeb', secondary: '#9b55a2', tertiary: '#efbbf3', surfaceTint: 'color-mix(in srgb, #e38aeb 12%, #111827)' },
  },
  {
    name: 'Eevee',
    sprite: '/pokemon/eevee.png',
    favorite: true,
    colors: { primary: '#a4624a', secondary: '#d59c4a', tertiary: '#e6c594', surfaceTint: 'color-mix(in srgb, #a4624a 12%, #111827)' },
  },
  {
    name: 'Snorlax',
    sprite: '/pokemon/snorlax.png',
    colors: { primary: '#72c6bd', secondary: '#397e78', tertiary: '#added9', surfaceTint: 'color-mix(in srgb, #72c6bd 12%, #111827)' },
  },
  {
    name: 'Psyduck',
    sprite: '/pokemon/psyduck.png',
    colors: { primary: '#f5c84c', secondary: '#a98425', tertiary: '#f9df97', surfaceTint: 'color-mix(in srgb, #f5c84c 12%, #111827)' },
  },
  {
    name: 'Jigglypuff',
    sprite: '/pokemon/jigglypuff.png',
    colors: { primary: '#f5a9cf', secondary: '#ad668b', tertiary: '#f9cde3', surfaceTint: 'color-mix(in srgb, #f5a9cf 12%, #111827)' },
  },
  {
    name: 'Lucario',
    sprite: '/pokemon/lucario.png',
    favorite: true,
    colors: { primary: '#5a5a5a', secondary: '#393939', tertiary: '#29739c', surfaceTint: 'color-mix(in srgb, #29739c 12%, #111827)' },
  },
  {
    name: 'Umbreon',
    sprite: '/pokemon/umbreon.png',
    favorite: true,
    colors: { primary: '#414152', secondary: '#29314a', tertiary: '#62627b', surfaceTint: 'color-mix(in srgb, #62627b 12%, #111827)' },
  },
  {
    name: 'Sylveon',
    sprite: '/pokemon/sylveon.png',
    colors: { primary: '#f39ac1', secondary: '#a95e80', tertiary: '#f8c4db', surfaceTint: 'color-mix(in srgb, #f39ac1 12%, #111827)' },
  },
  {
    name: 'Zorua de Hisui',
    sprite: '/pokemon/zorua-hisui.png',
    favorite: true,
    colors: { primary: '#fbf4f6', secondary: '#e01555', tertiary: '#212126', surfaceTint: 'color-mix(in srgb, #e01555 12%, #111827)' },
  },
  {
    name: 'Zoroark de Hisui',
    sprite: '/pokemon/zoroak-hisui.png',
    colors: { primary: '#e45b6e', secondary: '#963745', tertiary: '#efa0ab', surfaceTint: 'color-mix(in srgb, #e45b6e 12%, #111827)' },
  },
  {
    name: 'Zoroark',
    sprite: '/pokemon/zoroark.png',
    favorite: true,
    colors: { primary: '#62626a', secondary: '#2a3140', tertiary: '#7b2941', surfaceTint: 'color-mix(in srgb, #7b2941 12%, #111827)' },
  },
  {
    name: 'Ditto',
    sprite: '/pokemon/ditto.png',
    colors: { primary: '#c88de8', secondary: '#83579d', tertiary: '#dfbdf2', surfaceTint: 'color-mix(in srgb, #c88de8 12%, #111827)' },
  },
  {
    name: 'Charizard',
    sprite: '/pokemon/charizard.png',
    favorite: true,
    colors: { primary: '#ee8329', secondary: '#cd5241', tertiary: '#084152', surfaceTint: 'color-mix(in srgb, #ee8329 12%, #111827)' },
  },
  {
    name: 'Vaporeon',
    sprite: '/pokemon/vaporeon.png',
    colors: { primary: '#66bce8', secondary: '#397ca1', tertiary: '#a6d8f2', surfaceTint: 'color-mix(in srgb, #66bce8 12%, #111827)' },
  },
  {
    name: 'Jolteon',
    sprite: '/pokemon/jolteon.png',
    colors: { primary: '#f5d547', secondary: '#a98d21', tertiary: '#f9e794', surfaceTint: 'color-mix(in srgb, #f5d547 12%, #111827)' },
  },
  {
    name: 'Flareon',
    sprite: '/pokemon/flareon.png',
    colors: { primary: '#f27655', secondary: '#a74630', tertiary: '#f7b09c', surfaceTint: 'color-mix(in srgb, #f27655 12%, #111827)' },
  },
  {
    name: 'Piplup',
    sprite: '/pokemon/piplup.png',
    colors: { primary: '#65aef1', secondary: '#376fa9', tertiary: '#a6d0f7', surfaceTint: 'color-mix(in srgb, #65aef1 12%, #111827)' },
  },
  {
    name: 'Larvitar',
    sprite: '/pokemon/larvitar.png',
    colors: { primary: '#89c86a', secondary: '#568b3d', tertiary: '#bbdfa9', surfaceTint: 'color-mix(in srgb, #89c86a 12%, #111827)' },
  },
  {
    name: 'Froslass',
    sprite: '/pokemon/froslass.png',
    colors: { primary: '#8ee0ee', secondary: '#4c96a4', tertiary: '#bdedf5', surfaceTint: 'color-mix(in srgb, #8ee0ee 12%, #111827)' },
  },
  {
    name: 'Meloetta',
    sprite: '/pokemon/meloetta.png',
    colors: { primary: '#6ed7b8', secondary: '#3e9278', tertiary: '#abe8d6', surfaceTint: 'color-mix(in srgb, #6ed7b8 12%, #111827)' },
  },
  {
    name: 'Magikarp',
    sprite: '/pokemon/magikarp.png',
    colors: { primary: '#f28a4b', secondary: '#a95429', tertiary: '#f7bb97', surfaceTint: 'color-mix(in srgb, #f28a4b 12%, #111827)' },
  },
  {
    name: 'Growlithe',
    sprite: '/pokemon/growlithe.png',
    colors: { primary: '#e98c53', secondary: '#fff6a4', tertiary: '#decd7b', surfaceTint: 'color-mix(in srgb, #e98c53 12%, #111827)' },
  },
  {
    name: 'Arcanine',
    sprite: '/pokemon/arcanine.png',
    favorite: true,
    colors: { primary: '#d5a48b', secondary: '#ffdeac', tertiary: '#c5525a', surfaceTint: 'color-mix(in srgb, #d5a48b 12%, #111827)' },
  },
  {
    name: 'Chansey',
    sprite: '/pokemon/chansey.png',
    colors: { primary: '#f1a9c5', secondary: '#a76a83', tertiary: '#f7cddd', surfaceTint: 'color-mix(in srgb, #f1a9c5 12%, #111827)' },
  },
  {
    name: 'Zubat',
    sprite: '/pokemon/zubat.png',
    colors: { primary: '#848ee8', secondary: '#50599d', tertiary: '#b8bdf2', surfaceTint: 'color-mix(in srgb, #848ee8 12%, #111827)' },
  },
  {
    name: 'Deoxys',
    sprite: '/pokemon/deoxys.png',
    colors: { primary: '#ef6b58', secondary: '#a43e32', tertiary: '#f6a99e', surfaceTint: 'color-mix(in srgb, #ef6b58 12%, #111827)' },
  },
  {
    name: 'Elekid',
    sprite: '/pokemon/elekid.png',
    colors: { primary: '#f5d84e', secondary: '#a99027', tertiary: '#f9e898', surfaceTint: 'color-mix(in srgb, #f5d84e 12%, #111827)' },
  },
  {
    name: 'Shelmet',
    sprite: '/pokemon/shelmet.png',
    colors: { primary: '#dc8cbe', secondary: '#925879', tertiary: '#ebbcd9', surfaceTint: 'color-mix(in srgb, #dc8cbe 12%, #111827)' },
  },
  {
    name: 'Beldum',
    sprite: '/pokemon/beldum.png',
    colors: { primary: '#6eb4d8', secondary: '#3d7895', tertiary: '#abd4e8', surfaceTint: 'color-mix(in srgb, #6eb4d8 12%, #111827)' },
  },
  {
    name: 'Necrozma',
    sprite: '/pokemon/necrozma.png',
    colors: { primary: '#9c8ee8', secondary: '#62569e', tertiary: '#c6bdf2', surfaceTint: 'color-mix(in srgb, #9c8ee8 12%, #111827)' },
  },
  {
    name: 'Slakoth',
    sprite: '/pokemon/slakoth.png',
    colors: { primary: '#c59ccf', secondary: '#806288', tertiary: '#ddc6e3', surfaceTint: 'color-mix(in srgb, #c59ccf 12%, #111827)' },
  },
  {
    name: 'Seaking',
    sprite: '/pokemon/seaking.png',
    colors: { primary: '#ef795d', secondary: '#a34836', tertiary: '#f6b1a1', surfaceTint: 'color-mix(in srgb, #ef795d 12%, #111827)' },
  },
  {
    name: 'Joltik',
    sprite: '/pokemon/joltik.png',
    colors: { primary: '#f1d753', secondary: '#a38f29', tertiary: '#f7e89b', surfaceTint: 'color-mix(in srgb, #f1d753 12%, #111827)' },
  },
  {
    name: 'Vanillish',
    sprite: '/pokemon/vanillish.png',
    colors: { primary: '#a9e4ef', secondary: '#6399a5', tertiary: '#cdeff6', surfaceTint: 'color-mix(in srgb, #a9e4ef 12%, #111827)' },
  },
  {
    name: 'Ribombee',
    sprite: '/pokemon/ribombee.png',
    colors: { primary: '#f1cf69', secondary: '#a48738', tertiary: '#f7e3a8', surfaceTint: 'color-mix(in srgb, #f1cf69 12%, #111827)' },
  },
  {
    name: 'Sunflora',
    sprite: '/pokemon/sunflora.png',
    colors: { primary: '#f4cf42', secondary: '#a88720', tertiary: '#f9e391', surfaceTint: 'color-mix(in srgb, #f4cf42 12%, #111827)' },
  },
  {
    name: 'Cubchoo',
    sprite: '/pokemon/cubchoo.png',
    colors: { primary: '#81d4ed', secondary: '#478ca2', tertiary: '#b6e6f5', surfaceTint: 'color-mix(in srgb, #81d4ed 12%, #111827)' },
  },
  {
    name: 'Braixen',
    sprite: '/pokemon/braixen.png',
    colors: { primary: '#ef9c4d', secondary: '#a36229', tertiary: '#f6c698', surfaceTint: 'color-mix(in srgb, #ef9c4d 12%, #111827)' },
  },
  {
    name: 'Plusle',
    sprite: '/pokemon/plusle.png',
    colors: { primary: '#ef6d62', secondary: '#a33f38', tertiary: '#f6aaa4', surfaceTint: 'color-mix(in srgb, #ef6d62 12%, #111827)' },
  },
  {
    name: 'Cloyster',
    sprite: '/pokemon/cloyster.png',
    colors: { primary: '#9d82e1', secondary: '#625096', tertiary: '#c6b7ee', surfaceTint: 'color-mix(in srgb, #9d82e1 12%, #111827)' },
  },
  {
    name: 'Wailmer',
    sprite: '/pokemon/wailmer.png',
    colors: { primary: '#6eaee5', secondary: '#3e72a0', tertiary: '#abd0f0', surfaceTint: 'color-mix(in srgb, #6eaee5 12%, #111827)' },
  },
  {
    name: 'Tauros',
    sprite: '/pokemon/tauros.png',
    colors: { primary: '#d3a36a', secondary: '#8d693e', tertiary: '#e5caa9', surfaceTint: 'color-mix(in srgb, #d3a36a 12%, #111827)' },
  },
  {
    name: 'Hypno',
    sprite: '/pokemon/hypno.png',
    colors: { primary: '#e9cf4f', secondary: '#9c8928', tertiary: '#f2e399', surfaceTint: 'color-mix(in srgb, #e9cf4f 12%, #111827)' },
  },
  {
    name: 'Igglybuff',
    sprite: '/pokemon/igglybuff.png',
    colors: { primary: '#eda6cc', secondary: '#a26784', tertiary: '#f5cbe1', surfaceTint: 'color-mix(in srgb, #eda6cc 12%, #111827)' },
  },
  {
    name: 'Poipole',
    sprite: '/pokemon/poipole.png',
    colors: { primary: '#c377e5', secondary: '#7f469c', tertiary: '#dcb0f0', surfaceTint: 'color-mix(in srgb, #c377e5 12%, #111827)' },
  },
  {
    name: 'Honedge',
    sprite: '/pokemon/honedge.png',
    colors: { primary: '#7dc5df', secondary: '#447f96', tertiary: '#b4ddec', surfaceTint: 'color-mix(in srgb, #7dc5df 12%, #111827)' },
  },
  {
    name: 'Doublade',
    sprite: '/pokemon/doublade.png',
    colors: { primary: '#d67fc4', secondary: '#8e4c7f', tertiary: '#e7b5dd', surfaceTint: 'color-mix(in srgb, #d67fc4 12%, #111827)' },
  },
  {
    name: 'Dewott',
    sprite: '/pokemon/dewott.png',
    colors: { primary: '#70bce4', secondary: '#3e7b9c', tertiary: '#acd8ef', surfaceTint: 'color-mix(in srgb, #70bce4 12%, #111827)' },
  },
  {
    name: 'Slurpuff',
    sprite: '/pokemon/slurpuff.png',
    colors: { primary: '#efa6c5', secondary: '#a26780', tertiary: '#f6cbdd', surfaceTint: 'color-mix(in srgb, #efa6c5 12%, #111827)' },
  },
  {
    name: 'Swadloon',
    sprite: '/pokemon/swadloon.png',
    colors: { primary: '#8fce65', secondary: '#5a8b3b', tertiary: '#bee3a6', surfaceTint: 'color-mix(in srgb, #8fce65 12%, #111827)' },
  },
  {
    name: 'Rillaboom',
    sprite: '/pokemon/rillaboom.png',
    colors: { primary: '#65c16d', secondary: '#3b8042', tertiary: '#a6dbaa', surfaceTint: 'color-mix(in srgb, #65c16d 12%, #111827)' },
  },
  {
    name: 'Milcery',
    sprite: '/pokemon/milcery.png',
    colors: { primary: '#f0c6dc', secondary: '#a17d90', tertiary: '#f6deeb', surfaceTint: 'color-mix(in srgb, #f0c6dc 12%, #111827)' },
  },
  {
    name: 'Heliolisk',
    sprite: '/pokemon/heliolisk.png',
    colors: { primary: '#ecd047', secondary: '#9f8923', tertiary: '#f4e494', surfaceTint: 'color-mix(in srgb, #ecd047 12%, #111827)' },
  },
  {
    name: 'Dragalge',
    sprite: '/pokemon/dragalge.png',
    colors: { primary: '#b57bd1', secondary: '#75478e', tertiary: '#d4b2e4', surfaceTint: 'color-mix(in srgb, #b57bd1 12%, #111827)' },
  },
  {
    name: 'Numel',
    sprite: '/pokemon/numel.png',
    colors: { primary: '#e8aa62', secondary: '#9b6a37', tertiary: '#f2cea4', surfaceTint: 'color-mix(in srgb, #e8aa62 12%, #111827)' },
  },
  {
    name: 'Budew',
    sprite: '/pokemon/budew.png',
    colors: { primary: '#7ed16f', secondary: '#4a8b40', tertiary: '#b4e4ab', surfaceTint: 'color-mix(in srgb, #7ed16f 12%, #111827)' },
  },
  {
    name: 'Latias',
    sprite: '/pokemon/latias.png',
    colors: { primary: '#ee6f78', secondary: '#a24149', tertiary: '#f5abb1', surfaceTint: 'color-mix(in srgb, #ee6f78 12%, #111827)' },
  },
  {
    name: 'Blacephalon',
    sprite: '/pokemon/blacephalon.png',
    colors: { primary: '#65d8dc', secondary: '#378f93', tertiary: '#a6e8eb', surfaceTint: 'color-mix(in srgb, #65d8dc 12%, #111827)' },
  },
  {
    name: 'Komala',
    sprite: '/pokemon/komala.png',
    colors: { primary: '#9bc7db', secondary: '#608597', tertiary: '#c5dfea', surfaceTint: 'color-mix(in srgb, #9bc7db 12%, #111827)' },
  },
];

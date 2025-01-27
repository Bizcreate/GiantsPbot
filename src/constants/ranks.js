export const RANKS = [
  { name: "Kihei", multiplier: 1, minCoins: 1000 }, // Basic Soldier (1x)
  { name: "Ashigaru", multiplier: 5, minCoins: 5000 }, // Light Infantry (5x)
  { name: "Goshi", multiplier: 10, minCoins: 10000 }, // Rural Samurai (10x)
  { name: "Ronin", multiplier: 20, minCoins: 20000 }, // Wandering Samurai (20x)
  { name: "Bushi", multiplier: 40, minCoins: 40000 }, // Warrior (40x)
  { name: "Hatamoto", multiplier: 80, minCoins: 80000 }, // Banner Knight (80x)
  { name: "Kensei", multiplier: 160, minCoins: 160000 }, // Sword Saint (160x)
  { name: "Taisho", multiplier: 320, minCoins: 320000 }, // General (320x)
  { name: "Daimyo", multiplier: 640, minCoins: 640000 }, // Feudal Lord (640x)
  { name: "Shogun", multiplier: 1280, minCoins: 1280000 }, // Supreme Commander (1280x)
  { name: "Tenno", multiplier: 2560, minCoins: 2560000 }, // Emperor (2560x)
  { name: "Kami", multiplier: 5120, minCoins: 5120000 }, // Divine (5120x)
  { name: "Ryujin", multiplier: 10240, minCoins: 10240000 }, // Dragon God (10240x)
  { name: "Amaterasu", multiplier: 20480, minCoins: 20480000 }, // Sun Goddess (20480x)
  { name: "Susanoo", multiplier: 40960, minCoins: 40960000 }, // Storm God (40960x)
  { name: "Izanagi", multiplier: 81920, minCoins: 81920000 }, // Creator God (81920x)
];

// Helper function to get rank based on coin amount
export const getRank = (coins) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (coins >= RANKS[i].minCoins) {
      return RANKS[i];
    }
  }
  return RANKS[0]; // Default to lowest rank
};

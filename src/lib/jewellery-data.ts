// Hardcoded jewellery data for the customer-facing catalogue.
// Images are direct Unsplash photo URLs (loaded via CDN, no auth needed).

export type Jewel = {
  id: string;
  name: string;
  categoryId: string;
  price: number; // in INR
  originalPrice?: number;
  metal: string;
  weight: string; // e.g. "8.2 g"
  purity: string; // e.g. "22K"
  stones?: string;
  description: string;
  images: string[];
  tags: string[];
};

export type JewelCategory = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: string; // tailwind gradient tokens
};

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const jewelleryCategories: JewelCategory[] = [
  {
    id: "rings",
    name: "Rings",
    tagline: "Timeless bands & solitaires",
    description: "Diamond solitaires, eternity bands and heirloom-worthy statement rings.",
    image: U("photo-1605100804763-247f67b3557e"),
    accent: "from-rose-500/30 to-amber-400/30",
  },
  {
    id: "necklaces",
    name: "Necklaces",
    tagline: "From delicate to dramatic",
    description: "Layered chains, pendants and ceremonial haaram in 22K gold.",
    image: U("photo-1611591437281-460bfbe1220a"),
    accent: "from-amber-500/30 to-rose-500/30",
  },
  {
    id: "earrings",
    name: "Earrings",
    tagline: "Studs, hoops & drops",
    description: "Diamond studs, chandelier drops and everyday hoops.",
    image: U("photo-1535632066274-3ea27c9b3a01"),
    accent: "from-fuchsia-500/25 to-amber-400/30",
  },
  {
    id: "bangles",
    name: "Bangles",
    tagline: "Traditional & contemporary",
    description: "Kada, gold bangles and jewelled cuffs for every occasion.",
    image: U("photo-1602283403976-e19a3d80c8b1"),
    accent: "from-amber-600/30 to-yellow-400/30",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    tagline: "Sleek daily wear",
    description: "Tennis bracelets, chain links and gemstone accents.",
    image: U("photo-1573408301185-9146fe634ad0"),
    accent: "from-slate-400/30 to-rose-400/30",
  },
  {
    id: "pendants",
    name: "Pendants",
    tagline: "Little icons on a chain",
    description: "Solitaire pendants, initials and religious motifs.",
    image: U("photo-1599459183200-59c7687a1c3f"),
    accent: "from-pink-500/25 to-amber-400/30",
  },
];

export const jewelleryProducts: Jewel[] = [
  {
    id: "j-1",
    name: "Aurora Diamond Solitaire Ring",
    categoryId: "rings",
    price: 189000,
    originalPrice: 215000,
    metal: "18K White Gold",
    weight: "4.2 g",
    purity: "18K",
    stones: "0.72ct Round Brilliant Diamond",
    description:
      "A hand-set round brilliant diamond floats on a whisper-thin band of 18K white gold. A quiet, forever piece.",
    images: [
      U("photo-1605100804763-247f67b3557e"),
      U("photo-1602752250015-52934bc45613"),
      U("photo-1515562141207-7a88fb7ce338"),
    ],
    tags: ["Bestseller", "Diamond"],
  },
  {
    id: "j-2",
    name: "Meher 22K Gold Chain Necklace",
    categoryId: "necklaces",
    price: 84500,
    metal: "22K Yellow Gold",
    weight: "12.6 g",
    purity: "22K",
    description:
      "A softly hammered rope chain in 22K gold — the daily-wear necklace that layers beautifully with everything.",
    images: [
      U("photo-1611591437281-460bfbe1220a"),
      U("photo-1599643477877-530eb83abc8e"),
      U("photo-1535632066274-3ea27c9b3a01"),
    ],
    tags: ["New"],
  },
  {
    id: "j-3",
    name: "Kiran Diamond Halo Studs",
    categoryId: "earrings",
    price: 96800,
    originalPrice: 112000,
    metal: "18K Rose Gold",
    weight: "2.8 g",
    purity: "18K",
    stones: "0.40ct total Diamonds",
    description:
      "A rose-gold halo cradles a bright center diamond. Small enough for every day, brilliant enough for every night.",
    images: [
      U("photo-1535632066274-3ea27c9b3a01"),
      U("photo-1602752250015-52934bc45613"),
      U("photo-1596944924616-7b38e7cfac36"),
    ],
    tags: ["Bestseller"],
  },
  {
    id: "j-4",
    name: "Rani Antique Kundan Haaram",
    categoryId: "necklaces",
    price: 425000,
    metal: "22K Gold",
    weight: "78.4 g",
    purity: "22K",
    stones: "Kundan & polki",
    description:
      "A ceremonial haaram set with kundan and polki. Handcrafted by our master karigars over 42 days.",
    images: [
      U("photo-1611085583191-a3b181a88401"),
      U("photo-1617038220319-276d3cfab638"),
      U("photo-1611591437281-460bfbe1220a"),
    ],
    tags: ["Heritage", "Bridal"],
  },
  {
    id: "j-5",
    name: "Neel Sapphire Tennis Bracelet",
    categoryId: "bracelets",
    price: 148000,
    metal: "18K White Gold",
    weight: "9.1 g",
    purity: "18K",
    stones: "Blue Sapphires 3.2ct",
    description:
      "A river of blue sapphires runs the length of this bracelet, each stone individually claw-set for maximum sparkle.",
    images: [
      U("photo-1573408301185-9146fe634ad0"),
      U("photo-1584811644165-33078f50cdfc"),
      U("photo-1599643477877-530eb83abc8e"),
    ],
    tags: ["Sapphire"],
  },
  {
    id: "j-6",
    name: "Anaya Temple Gold Bangles (Pair)",
    categoryId: "bangles",
    price: 168500,
    metal: "22K Gold",
    weight: "24.8 g",
    purity: "22K",
    description:
      "A pair of temple-inspired 22K gold bangles with fine granulation work. Sold as a matched pair.",
    images: [
      U("photo-1602283403976-e19a3d80c8b1"),
      U("photo-1617038220319-276d3cfab638"),
      U("photo-1611085583191-a3b181a88401"),
    ],
    tags: ["Traditional"],
  },
  {
    id: "j-7",
    name: "Ira Emerald Drop Pendant",
    categoryId: "pendants",
    price: 74600,
    metal: "18K Yellow Gold",
    weight: "3.4 g",
    purity: "18K",
    stones: "1.1ct Emerald, Diamond halo",
    description:
      "A Zambian emerald drop framed in a diamond halo, hanging from a fine 18K gold cable chain.",
    images: [
      U("photo-1599459183200-59c7687a1c3f"),
      U("photo-1583937443351-c2e3e29f5f6c"),
      U("photo-1611591437281-460bfbe1220a"),
    ],
    tags: ["Emerald", "New"],
  },
  {
    id: "j-8",
    name: "Sana Rose Gold Stackable Ring",
    categoryId: "rings",
    price: 32500,
    metal: "14K Rose Gold",
    weight: "1.9 g",
    purity: "14K",
    stones: "Micro-pavé Diamonds 0.12ct",
    description:
      "A slim rose-gold band micro-set with diamonds. Wear one, or stack three.",
    images: [
      U("photo-1602173574767-37ac01994b2a"),
      U("photo-1617038220319-276d3cfab638"),
      U("photo-1605100804763-247f67b3557e"),
    ],
    tags: ["Everyday"],
  },
  {
    id: "j-9",
    name: "Mira Pearl Chandelier Earrings",
    categoryId: "earrings",
    price: 58900,
    metal: "18K Gold",
    weight: "5.6 g",
    purity: "18K",
    stones: "South Sea Pearls & Diamonds",
    description:
      "Fresh south-sea pearls dance from a diamond-set chandelier frame. A modern take on a bridal classic.",
    images: [
      U("photo-1620656798579-1984d9e87df7"),
      U("photo-1596944924616-7b38e7cfac36"),
      U("photo-1611591437281-460bfbe1220a"),
    ],
    tags: ["Pearl", "Bridal"],
  },
  {
    id: "j-10",
    name: "Tara Diamond Line Bracelet",
    categoryId: "bracelets",
    price: 218000,
    originalPrice: 245000,
    metal: "18K White Gold",
    weight: "8.4 g",
    purity: "18K",
    stones: "Diamonds 2.1ct total",
    description:
      "A single line of round brilliants, individually claw-set — the tennis bracelet, quietly refined.",
    images: [
      U("photo-1584811644165-33078f50cdfc"),
      U("photo-1573408301185-9146fe634ad0"),
      U("photo-1602752250015-52934bc45613"),
    ],
    tags: ["Bestseller", "Diamond"],
  },
  {
    id: "j-11",
    name: "Vira Ruby Cocktail Ring",
    categoryId: "rings",
    price: 132400,
    metal: "18K Yellow Gold",
    weight: "6.1 g",
    purity: "18K",
    stones: "2.4ct Ruby, Diamond halo",
    description:
      "A rich Burmese ruby set in yellow gold with a delicate diamond halo. Evening drama, made wearable.",
    images: [
      U("photo-1617038220319-276d3cfab638"),
      U("photo-1602173574767-37ac01994b2a"),
      U("photo-1605100804763-247f67b3557e"),
    ],
    tags: ["Ruby", "Statement"],
  },
  {
    id: "j-12",
    name: "Ojas Diamond Om Pendant",
    categoryId: "pendants",
    price: 42800,
    metal: "18K Yellow Gold",
    weight: "2.6 g",
    purity: "18K",
    stones: "Diamonds 0.18ct",
    description:
      "A modern Om motif rendered in diamond pavé. Comes on an adjustable 18K gold chain.",
    images: [
      U("photo-1583937443351-c2e3e29f5f6c"),
      U("photo-1599459183200-59c7687a1c3f"),
      U("photo-1535632066274-3ea27c9b3a01"),
    ],
    tags: ["Everyday"],
  },
];

export const heroImage = U("photo-1515562141207-7a88fb7ce338", 1600);
export const brandMark = U("photo-1605100804763-247f67b3557e", 200);

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function findJewel(id: string) {
  return jewelleryProducts.find((p) => p.id === id);
}

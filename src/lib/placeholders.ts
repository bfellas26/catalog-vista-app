// Placeholder data for scaffold pages.
export const placeholderStats = [
  { label: "Total Clients", value: "148", delta: "+12%", trend: "up" as const },
  { label: "Active Catalogs", value: "94", delta: "+4%", trend: "up" as const },
  { label: "Monthly Revenue", value: "$24,580", delta: "+8.2%", trend: "up" as const },
  { label: "Support Tickets", value: "12", delta: "-3%", trend: "down" as const },
];

export const placeholderBusinessStats = [
  { label: "Total Products", value: "312", delta: "+18", trend: "up" as const },
  { label: "Categories", value: "24", delta: "+2", trend: "up" as const },
  { label: "Subscribers", value: "1,842", delta: "+124", trend: "up" as const },
  { label: "Open Enquiries", value: "27", delta: "+5", trend: "up" as const },
];

export const placeholderClients = Array.from({ length: 8 }).map((_, i) => ({
  id: `c-${i + 1}`,
  name: [
    "Aurora Textiles",
    "Bloom & Co.",
    "Cedar Home",
    "Drift Coffee",
    "Ember Studio",
    "Fable Books",
    "Grove Ceramics",
    "Halo Beauty",
  ][i],
  email: `hello@company${i + 1}.com`,
  plan: ["Starter", "Growth", "Pro", "Enterprise"][i % 4],
  status: i % 3 === 0 ? "Trial" : "Active",
  createdAt: "Mar 12, 2025",
}));

export const placeholderCategories = [
  { id: "cat-1", name: "Apparel", products: 42, updated: "2 days ago" },
  { id: "cat-2", name: "Accessories", products: 28, updated: "1 week ago" },
  { id: "cat-3", name: "Home & Living", products: 63, updated: "3 days ago" },
  { id: "cat-4", name: "Stationery", products: 19, updated: "5 days ago" },
  { id: "cat-5", name: "Beauty", products: 34, updated: "Today" },
  { id: "cat-6", name: "Gifts", products: 12, updated: "Yesterday" },
];

export const placeholderProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: `p-${i + 1}`,
  name: [
    "Linen Everyday Shirt",
    "Ceramic Pour-Over",
    "Walnut Desk Tray",
    "Merino Wool Throw",
    "Brass Table Lamp",
    "Field Notebook",
    "Aromatic Candle",
    "Leather Cardholder",
    "Handwoven Basket",
    "Cotton Bath Towel",
    "Enamel Mug Set",
    "Silk Hair Scarf",
  ][i],
  price: 24 + i * 7,
  category: ["Apparel", "Home & Living", "Accessories", "Beauty"][i % 4],
  tags: ["New", "Bestseller", "Limited"].slice(0, (i % 3) + 1),
  stock: i % 5 === 0 ? "Out of stock" : "In stock",
}));

export const placeholderTags = [
  { id: "t-1", name: "New", used: 24, color: "gold" },
  { id: "t-2", name: "Bestseller", used: 12, color: "primary" },
  { id: "t-3", name: "Limited", used: 8, color: "warning" },
  { id: "t-4", name: "Sale", used: 15, color: "danger" },
];

export const placeholderSubscribers = Array.from({ length: 6 }).map((_, i) => ({
  id: `s-${i + 1}`,
  email: `subscriber${i + 1}@mail.com`,
  joined: "Mar 2025",
  source: ["Website", "Cart", "Landing"][i % 3],
}));

export const placeholderEnquiries = Array.from({ length: 5 }).map((_, i) => ({
  id: `e-${i + 1}`,
  name: ["Anna Reyes", "Marcus Cole", "Priya Shah", "Leo Martins", "Sara Kim"][i],
  email: `contact${i + 1}@mail.com`,
  items: 2 + i,
  status: ["Open", "Responded", "Closed"][i % 3],
  createdAt: "Today",
}));

export const chartData = [
  { name: "Jan", value: 420 },
  { name: "Feb", value: 560 },
  { name: "Mar", value: 640 },
  { name: "Apr", value: 780 },
  { name: "May", value: 920 },
  { name: "Jun", value: 1050 },
  { name: "Jul", value: 1180 },
];

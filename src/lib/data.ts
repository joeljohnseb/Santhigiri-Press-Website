import type {
  Category,
  DeliveryZone,
  PaperSize,
  PaperType,
  PickupLocation,
  PricingRule,
  Product,
} from "./types";

export const categories: Category[] = [
  {
    id: "cat-academic",
    name: "Academic",
    slug: "academic",
    description: "Assignments, reports, notes, and project submissions",
    icon: "book-open",
  },
  {
    id: "cat-fests",
    name: "Events & Fests",
    slug: "events-fests",
    description: "Fest brochures, invitations, and event stationery",
    icon: "party-popper",
  },
  {
    id: "cat-posters",
    name: "Posters & Banners",
    slug: "posters-banners",
    description: "Posters, flex prints, and department banners",
    icon: "image",
  },
  {
    id: "cat-certificates",
    name: "Certificates",
    slug: "certificates",
    description: "Course certificates, merit cards, and ID cards",
    icon: "award",
  },
  {
    id: "cat-other",
    name: "Other",
    slug: "other",
    description: "Custom print jobs and special requests",
    icon: "printer",
  },
];

export const paperTypes: PaperType[] = [
  { id: "paper-80gsm", name: "80 GSM Bond", description: "Standard copier paper" },
  { id: "paper-100gsm", name: "100 GSM", description: "Thicker paper for reports" },
  { id: "paper-glossy", name: "Glossy Photo", description: "For posters and photos" },
  { id: "paper-matte", name: "Matte Photo", description: "Non-reflective finish" },
];

export const paperSizes: PaperSize[] = [
  { id: "size-a4", name: "A4", widthMm: 210, heightMm: 297 },
  { id: "size-a3", name: "A3", widthMm: 297, heightMm: 420 },
  { id: "size-a5", name: "A5", widthMm: 148, heightMm: 210 },
  { id: "size-legal", name: "Legal", widthMm: 216, heightMm: 356 },
];

export const products: Product[] = [
  {
    id: "prod-xerox-bw",
    categoryId: "cat-academic",
    name: "Black & White Xerox",
    description: "Single or double-sided photocopy for notes and assignments",
    basePrice: 2,
    minQuantity: 1,
    supportsColor: false,
    requiresQuote: false,
    turnaroundHours: 2,
  },
  {
    id: "prod-xerox-color",
    categoryId: "cat-academic",
    name: "Colour Print",
    description: "Full colour printing for charts and presentations",
    basePrice: 10,
    minQuantity: 1,
    supportsColor: true,
    requiresQuote: false,
    turnaroundHours: 4,
  },
  {
    id: "prod-spiral",
    categoryId: "cat-academic",
    name: "Spiral Binding",
    description: "Report binding with transparent cover",
    basePrice: 40,
    minQuantity: 1,
    supportsColor: false,
    requiresQuote: true,
    turnaroundHours: 24,
  },
  {
    id: "prod-fest-flyer",
    categoryId: "cat-fests",
    name: "Fest Flyers",
    description: "Single-side flyers for campus events",
    basePrice: 5,
    minQuantity: 50,
    supportsColor: true,
    requiresQuote: false,
    turnaroundHours: 24,
  },
  {
    id: "prod-poster-a3",
    categoryId: "cat-posters",
    name: "A3 Poster",
    description: "High-quality poster print on photo paper",
    basePrice: 60,
    minQuantity: 1,
    supportsColor: true,
    requiresQuote: false,
    turnaroundHours: 24,
  },
  {
    id: "prod-banner",
    categoryId: "cat-posters",
    name: "Flex Banner",
    description: "Large format banner for stage and gates",
    basePrice: 0,
    minQuantity: 1,
    supportsColor: true,
    requiresQuote: true,
    turnaroundHours: 48,
  },
  {
    id: "prod-certificate",
    categoryId: "cat-certificates",
    name: "Certificate Print",
    description: "Pre-printed certificate sheets with custom text",
    basePrice: 15,
    minQuantity: 10,
    supportsColor: true,
    requiresQuote: false,
    turnaroundHours: 48,
  },
  {
    id: "prod-custom",
    categoryId: "cat-other",
    name: "Custom Print Job",
    description: "Tell us your requirements and we will quote",
    basePrice: 0,
    minQuantity: 1,
    supportsColor: true,
    requiresQuote: true,
    turnaroundHours: 48,
  },
];

export const pricingRules: PricingRule[] = [
  {
    id: "rule-1",
    productId: "prod-xerox-bw",
    paperTypeId: "paper-80gsm",
    paperSizeId: "size-a4",
    colorOption: "bw",
    pricePerUnit: 2,
    minQuantity: 1,
  },
  {
    id: "rule-2",
    productId: "prod-xerox-bw",
    paperTypeId: "paper-80gsm",
    paperSizeId: "size-a4",
    colorOption: "bw",
    pricePerUnit: 1.5,
    minQuantity: 100,
  },
  {
    id: "rule-3",
    productId: "prod-xerox-color",
    paperTypeId: "paper-80gsm",
    paperSizeId: "size-a4",
    colorOption: "color",
    pricePerUnit: 10,
    minQuantity: 1,
  },
  {
    id: "rule-4",
    productId: "prod-fest-flyer",
    paperTypeId: "paper-100gsm",
    paperSizeId: "size-a5",
    colorOption: "color",
    pricePerUnit: 5,
    minQuantity: 50,
  },
  {
    id: "rule-5",
    productId: "prod-poster-a3",
    paperTypeId: "paper-glossy",
    paperSizeId: "size-a3",
    colorOption: "color",
    pricePerUnit: 60,
    minQuantity: 1,
  },
  {
    id: "rule-6",
    productId: "prod-certificate",
    paperTypeId: "paper-100gsm",
    paperSizeId: "size-a4",
    colorOption: "color",
    pricePerUnit: 15,
    minQuantity: 10,
  },
];

export const pickupLocations: PickupLocation[] = [
  {
    id: "pickup-press",
    name: "Main Press Counter",
    description: "Ground floor, Admin Block",
    hours: "Mon–Sat, 9:00 AM – 5:00 PM",
  },
  {
    id: "pickup-library",
    name: "Central Library Gate",
    description: "Collection point near main entrance",
    hours: "Mon–Sat, 10:00 AM – 4:00 PM",
  },
  {
    id: "pickup-hostel",
    name: "Hostel Block A Office",
    description: "For hostel residents only",
    hours: "Mon–Fri, 4:00 PM – 6:00 PM",
  },
];

export const deliveryZones: DeliveryZone[] = [
  {
    id: "zone-campus",
    name: "Campus Hostels",
    pincodes: ["682001", "682002", "682003"],
    charge: 20,
  },
  {
    id: "zone-nearby",
    name: "Nearby Areas",
    pincodes: ["682004", "682005"],
    charge: 50,
  },
];

export const businessInfo = {
  name: "Santhigiri College Press",
  tagline: "Campus printing made simple",
  phone: "+91 98765 43210",
  email: "press@santhigiri.edu",
  hours: "Mon–Sat, 9:00 AM – 5:00 PM",
  address: "Santhigiri College Campus, Admin Block",
};

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getPaperTypeById(id: string): PaperType | undefined {
  return paperTypes.find((p) => p.id === id);
}

export function getPaperSizeById(id: string): PaperSize | undefined {
  return paperSizes.find((p) => p.id === id);
}

export function getPickupLocationById(id: string): PickupLocation | undefined {
  return pickupLocations.find((p) => p.id === id);
}

export function getDeliveryZoneByPincode(pincode: string): DeliveryZone | undefined {
  return deliveryZones.find((z) => z.pincodes.includes(pincode));
}

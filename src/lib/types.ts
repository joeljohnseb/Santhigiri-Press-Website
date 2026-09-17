export type UserRole = "customer" | "admin";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "printing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type PaymentMethod = "online" | "counter";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type FulfillmentType = "pickup" | "delivery";
export type ColorOption = "bw" | "color";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface PaperType {
  id: string;
  name: string;
  description: string;
}

export interface PaperSize {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  minQuantity: number;
  supportsColor: boolean;
  requiresQuote: boolean;
  turnaroundHours: number;
}

export interface PricingRule {
  id: string;
  productId: string;
  paperTypeId: string;
  paperSizeId: string;
  colorOption: ColorOption;
  pricePerUnit: number;
  minQuantity: number;
}

export interface PickupLocation {
  id: string;
  name: string;
  description: string;
  hours: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  pincodes: string[];
  charge: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  paperTypeId: string;
  paperTypeName: string;
  paperSizeId: string;
  paperSizeName: string;
  colorOption: ColorOption;
  unitPrice: number;
  totalPrice: number;
  files: UploadedFile[];
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  studentId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentType: FulfillmentType;
  pickupLocationId?: string;
  pickupLocationName?: string;
  deliveryAddress?: string;
  deliveryPincode?: string;
  createdAt: string;
  updatedAt: string;
  estimatedReadyAt?: string;
}

export interface QuoteRequest {
  productId: string;
  quantity: number;
  paperTypeId: string;
  paperSizeId: string;
  colorOption: ColorOption;
}

export interface QuoteResponse {
  unitPrice: number;
  totalPrice: number;
  requiresManualQuote: boolean;
  message?: string;
  turnaroundHours: number;
}

import { promises as fs } from "fs";
import path from "path";
import type { Order, OrderStatus } from "./types";
import { generateOrderNumber } from "./utils";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

async function ensureOrdersFile(): Promise<void> {
  const dir = path.dirname(ORDERS_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]", "utf-8");
  }
}

async function readOrders(): Promise<Order[]> {
  await ensureOrdersFile();
  const content = await fs.readFile(ORDERS_FILE, "utf-8");
  return JSON.parse(content) as Order[];
}

async function writeOrders(orders: Order[]): Promise<void> {
  await ensureOrdersFile();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function getAllOrders(): Promise<Order[]> {
  const orders = await readOrders();
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const orders = await readOrders();
  return orders
    .filter((o) => o.customer.email.toLowerCase() === email.toLowerCase())
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function createOrder(
  order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
): Promise<Order> {
  const orders = await readOrders();
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...order,
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    createdAt: now,
    updatedAt: now,
  };
  orders.push(newOrder);
  await writeOrders(orders);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | undefined> {
  const orders = await readOrders();
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return undefined;

  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeOrders(orders);
  return orders[index];
}

export async function updateOrderPayment(
  id: string,
  paymentStatus: Order["paymentStatus"]
): Promise<Order | undefined> {
  const orders = await readOrders();
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return undefined;

  orders[index] = {
    ...orders[index],
    paymentStatus,
    updatedAt: new Date().toISOString(),
  };
  await writeOrders(orders);
  return orders[index];
}

export async function getOrderStats() {
  const orders = await readOrders();
  const today = new Date().toDateString();

  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProgress: orders.filter((o) =>
      ["confirmed", "printing"].includes(o.status)
    ).length,
    ready: orders.filter((o) => o.status === "ready").length,
    todayOrders: orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    ).length,
    revenue: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0),
  };
}

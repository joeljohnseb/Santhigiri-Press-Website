import { getAllOrders } from "@/lib/orders";
import { Card } from "@/components/ui/card";

export default async function AdminCustomersPage() {
  const orders = await getAllOrders();

  const customers = Array.from(
    orders.reduce((map, order) => {
      const key = order.customer.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.total;
      } else {
        map.set(key, {
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          studentId: order.customer.studentId,
          orderCount: 1,
          totalSpent: order.total,
        });
      }
      return map;
    }, new Map<string, { name: string; email: string; phone: string; studentId?: string; orderCount: number; totalSpent: number }>())
  ).map(([, customer]) => customer);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
      <p className="mt-1 text-slate-600">{customers.length} unique customers</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Total spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.email} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium">{customer.name}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.phone}</td>
                <td className="px-4 py-3">{customer.orderCount}</td>
                <td className="px-4 py-3">₹{customer.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="p-8 text-center text-slate-500">No customers yet.</p>
        )}
      </div>
    </div>
  );
}

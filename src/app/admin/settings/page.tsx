import { businessInfo, deliveryZones, pickupLocations } from "@/lib/data";
import { Card } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mt-1 text-slate-600">Business information and delivery configuration</p>

      <Card className="mt-8">
        <h2 className="font-semibold">Business details</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Name</dt>
            <dd>{businessInfo.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Phone</dt>
            <dd>{businessInfo.phone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd>{businessInfo.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Hours</dt>
            <dd>{businessInfo.hours}</dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-6">
        <h2 className="font-semibold">Pickup locations</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {pickupLocations.map((loc) => (
            <li key={loc.id} className="border-b border-slate-100 pb-3 last:border-0">
              <p className="font-medium">{loc.name}</p>
              <p className="text-slate-500">{loc.description}</p>
              <p className="text-slate-400">{loc.hours}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <h2 className="font-semibold">Delivery zones</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {deliveryZones.map((zone) => (
            <li key={zone.id} className="border-b border-slate-100 pb-3 last:border-0">
              <p className="font-medium">
                {zone.name} — ₹{zone.charge}
              </p>
              <p className="text-slate-500">Pincodes: {zone.pincodes.join(", ")}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <h2 className="font-semibold">Environment variables</h2>
        <ul className="mt-4 space-y-1 font-mono text-xs text-slate-600">
          <li>ADMIN_PASSWORD — admin login password</li>
          <li>NEXT_PUBLIC_SUPABASE_URL — Supabase project URL</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon key</li>
          <li>RAZORPAY_KEY_ID — Razorpay public key</li>
          <li>RAZORPAY_KEY_SECRET — Razorpay secret key</li>
        </ul>
      </Card>
    </div>
  );
}

import { businessInfo } from "@/lib/data";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="font-semibold text-slate-900">{businessInfo.name}</h3>
          <p className="mt-2 text-sm text-slate-600">{businessInfo.tagline}</p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-700" />
            {businessInfo.address}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-700" />
            {businessInfo.hours}
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-brand-700" />
            {businessInfo.phone}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-brand-700" />
            {businessInfo.email}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
      </div>
    </footer>
  );
}

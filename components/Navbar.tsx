"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Navigation, Info } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Map", icon: Map },
    { href: "/directions", label: "Directions", icon: Navigation },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-14 flex items-center px-4 gap-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <Map className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-800 text-base hidden sm:block">
          Maps
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors " +
              (pathname === href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100")
            }
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:block">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

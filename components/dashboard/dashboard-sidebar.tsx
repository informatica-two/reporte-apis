"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ShoppingCart,
  HandCoins,
  Users,
  LayoutDashboard,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
};

const NAV_ITEMS: SidebarItem[] = [
  { id: "home", label: "Inicio", href: "/", icon: <Home className="h-5 w-5" /> },
  { id: "ventas", label: "Ventas", href: "/ventas", icon: <ShoppingCart className="h-5 w-5" /> },
  { id: "cobros", label: "Cobros", href: "/#cobros", icon: <HandCoins className="h-5 w-5" /> },
  { id: "reclutamientos", label: "Reclutamientos", href: "/#reclutamientos", icon: <Users className="h-5 w-5" /> },
];

function isActive(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (item: SidebarItem) => {
    if (item.href.startsWith("/#")) {
      const sectionId = item.href.slice(2);
      if (pathname === "/") {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        router.push(item.href);
      }
    }
  };

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-4">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const classes = cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        );
        const isHash = item.href.startsWith("/#");

        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              {isHash ? (
                <button
                  type="button"
                  onClick={() => handleClick(item)}
                  className={classes}
                >
                  {item.icon}
                </button>
              ) : (
                <Link href={item.href} className={classes}>
                  {item.icon}
                </Link>
              )}
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}

      <div className="my-2 h-px w-8 bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/personalizable"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              pathname === "/personalizable"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">Dashboard Personalizable</TooltipContent>
      </Tooltip>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import NProgress from "nprogress";
import {
  Home,
  ShoppingCart,
  HandCoins,
  Users,
  LayoutDashboard,
  RefreshCw,
  Moon,
  Sun,
  UserRoundPlus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
};

const NAV_ITEMS: SidebarItem[] = [
  {
    id: "home",
    label: "Inicio",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: "ventas",
    label: "Ventas",
    href: "/ventas",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    id: "cobros",
    label: "Cobros",
    href: "/cobros",
    icon: <HandCoins className="h-5 w-5" />,
  },
  {
    id: "activos",
    label: "Activos",
    href: "/activos",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "reclutamientos",
    label: "Reclutamientos",
    href: "/#reclutamientos",
    icon: <UserRoundPlus className="h-5 w-5" />,
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export type DashboardSidebarProps = {
  onRefresh?: () => void;
};

export function DashboardSidebar({ onRefresh }: DashboardSidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleClick = (item: SidebarItem) => {
    if (item.href.startsWith("/#")) {
      const sectionId = item.href.slice(2);
      if (pathname === "/") {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        NProgress.start();
        router.push(item.href);
      }
    }
  };

  const handleLinkClick = () => {
    NProgress.start();
  };

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-4">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const classes = cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
                <Link
                  href={item.href}
                  className={classes}
                  onClick={handleLinkClick}
                >
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
            onClick={handleLinkClick}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              pathname === "/personalizable"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">Dashboard Personalizable</TooltipContent>
      </Tooltip>

      <div className="mt-auto flex flex-col gap-1">
        {onRefresh && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                className="h-10 w-10 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Actualizar datos</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="h-10 w-10 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isDark ? "Modo claro" : "Modo oscuro"}
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}

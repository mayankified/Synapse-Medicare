import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bed,
  Calendar,
  HandHelping,
  Hospital,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: Bed, label: "Bed Management", href: "/beds" },
  { icon: Bed, label: "Verify Bot Response", href: "/verify" },
  { icon: HandHelping, label: "Handoff Companion", href: "/handoff" },
];

export function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="p-6">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-lg">  MediCare</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex-1">
            <p className="text-sm font-medium">{"Mayank"}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

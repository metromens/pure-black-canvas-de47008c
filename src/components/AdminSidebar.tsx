import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingBag, Settings, Package, BarChart3, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const baseItemCls = "rounded-full bg-sidebar-accent text-sidebar-accent-foreground px-4 py-2 h-10 flex items-center transition-colors";
  const activeItemCls = " !bg-white !text-black font-semibold";

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <Sidebar 
      className="bg-sidebar border-r-2 border-sidebar-border transition-all duration-300"
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo/Brand Section with black decorative elements */}
        <div className={`py-6 border-b-2 border-sidebar-accent/30 ${collapsed ? "px-2 flex justify-center" : "px-4"}`}>
          {collapsed ? (
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center font-bold text-sidebar-accent-foreground text-sm border-2 border-sidebar-accent shadow-lg">
              MM
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-sidebar-accent flex items-center justify-center font-bold text-sidebar-accent-foreground border-2 border-sidebar-accent shadow-lg">
                MM
              </div>
              <div>
                <h2 className="text-sidebar-foreground font-bold text-lg tracking-tight">Metro Men's</h2>
                <p className="text-sidebar-foreground/70 text-xs font-medium">Admin Panel</p>
              </div>
            </div>
          )}
        </div>

        <SidebarGroup className="py-4">
          <SidebarGroupLabel className={`${collapsed ? "sr-only" : "px-4 text-sidebar-foreground/70 uppercase text-xs font-bold tracking-wider mb-2"}`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className={collapsed ? "px-1" : "px-3"}>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === item.url}
                    className={`${collapsed ? "rounded-full bg-sidebar-accent text-sidebar-accent-foreground w-10 h-10 flex items-center justify-center p-0" : baseItemCls}${currentPath === item.url ? activeItemCls : ""}`}
                  >
                    <NavLink 
                      to={item.url} 
                      end
                      className={collapsed ? "flex items-center justify-center w-full h-full" : ""}
                    >
                      <item.icon className="h-5 w-5" strokeWidth={2.5} />
                      {!collapsed && <span className="text-sm font-semibold ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className={`mt-auto border-t-2 border-sidebar-accent/30 ${collapsed ? "px-1 py-4" : "px-3 py-4"}`}>
          <button
            onClick={handleLogout}
            className={`${collapsed ? "rounded-full bg-sidebar-accent text-sidebar-accent-foreground w-10 h-10 flex items-center justify-center p-0 hover:bg-destructive hover:text-destructive-foreground transition-colors" : baseItemCls + " w-full justify-start hover:bg-destructive hover:text-destructive-foreground"}`}
          >
            <LogOut className="h-5 w-5" strokeWidth={2.5} />
            {!collapsed && <span className="text-sm font-semibold ml-3">Logout</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

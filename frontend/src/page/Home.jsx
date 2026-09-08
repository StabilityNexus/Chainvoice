// Home.js - dashboard shell: collapsible nav rail on desktop, drawer below lg

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DraftsIcon from "@mui/icons-material/Drafts";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LinkIcon from "@mui/icons-material/Link";
import SettingsIcon from "@mui/icons-material/Settings";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FileStackIcon, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import OnboardingProfileDialog from "@/components/OnboardingProfileDialog";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SHELL } from "@/utils/layout";

const MENU_ITEMS = [
  {
    text: "Send Invoice",
    icon: <AddCircleOutlineIcon />,
    route: "create",
    color: "#f472b6",
  },
  {
    text: "Send Multiple Invoices",
    icon: <FileStackIcon />,
    route: "batch-invoice",
    color: "#22c55e",
  },
  {
    text: "Sent Invoices",
    icon: <MailOutlineIcon />,
    route: "sent",
    color: "#4ade80",
  },
  {
    text: "Request Invoices",
    icon: <LinkIcon />,
    route: "generate-link",
    color: "#a78bfa",
  },
  {
    text: "Received Invoices",
    icon: <DraftsIcon />,
    route: "pending",
    color: "#60a5fa",
  },
  {
    text: "Import Invoice",
    icon: <DownloadForOfflineIcon />,
    route: "import",
    color: "#38bdf8",
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    route: "settings",
    color: "#9ca3af",
  },
];

const RAIL_WIDTH = 248;
const RAIL_WIDTH_COLLAPSED = 68;
const RAIL_COLLAPSED_KEY = "chainvoice_dashboard_rail_collapsed";
const NAV_DRAWER_ID = "dashboard-nav-drawer";

// Tailwind's lg, which the hamburger and the rail are keyed to. MUI's own `lg`
// is 1200px, so relying on it here would leave the drawer mounted between
// 1024px and 1199px where the hamburger that closes it is already hidden.
const LG_QUERY = "(min-width: 1024px)";

/**
 * Reads the rail preference synchronously. localStorage rather than the
 * IndexedDB used for app data: an async read would render the rail expanded
 * and then snap it closed on every load.
 */
const readRailCollapsed = () => {
  try {
    return window.localStorage.getItem(RAIL_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
};

/**
 * The dashboard navigation list. Rendered by the desktop rail (expanded or
 * collapsed to icons) and by the mobile drawer, so the variants cannot drift.
 */
function DashboardNav({ activeRoute, onNavigate, collapsed = false }) {
  return (
    <List className="space-y-1" sx={{ py: 0 }}>
      {MENU_ITEMS.map((item) => {
        const isActive = activeRoute === item.route;

        return (
          <ListItem key={item.route} disablePadding className="text-white">
            <Tooltip
              title={collapsed ? item.text : ""}
              placement="right"
              arrow
              disableHoverListener={!collapsed}
            >
              <ListItemButton
                onClick={() => onNavigate(item.route)}
                selected={isActive}
                aria-label={item.text}
                sx={{
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  justifyContent: collapsed ? "center" : "flex-start",
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.08)"
                    : "transparent",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                  "&.Mui-selected": { borderLeft: `4px solid ${item.color}` },
                  padding: collapsed ? "10px 0" : "9px 14px",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : "32px",
                    justifyContent: "center",
                    color: item.color,
                    fontSize: "1.15rem",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.925rem",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
}

/**
 * The dashboard greeting. The connected address and network deliberately are
 * not repeated here — the navbar already shows both.
 */
function RailGreeting() {
  return (
    <p className="text-base text-white">
      Welcome <span className="font-medium text-green-400">Back!</span>
    </p>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loading: profileLoading,
    isComplete: hasProfile,
    onboardingDismissed,
    dismissOnboarding,
  } = useUserProfile();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(readRailCollapsed);

  // First visit only: prompt for the sender details every invoice needs, once
  // storage has actually been read and once the user has not already skipped.
  useEffect(() => {
    if (profileLoading) return;
    setShowOnboarding(!hasProfile && !onboardingDismissed);
  }, [profileLoading, hasProfile, onboardingDismissed]);

  // Widening past lg hides the drawer and its hamburger by CSS, but the modal
  // would stay open and keep the body scroll locked with nothing left to close
  // it. Closing on the breakpoint keeps state and layout in step.
  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    const handleChange = (e) => {
      if (e.matches) setNavOpen(false);
    };

    handleChange(mq);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const activeRoute =
    MENU_ITEMS.find((item) => location.pathname.includes(item.route))?.route ??
    "create";

  const activeLabel =
    MENU_ITEMS.find((item) => item.route === activeRoute)?.text ?? "Dashboard";

  // Navigating from the drawer has to close it, or the overlay stays parked
  // over the page the user just asked for.
  const handleNavigate = useCallback(
    (route) => {
      navigate(route);
      setNavOpen(false);
    },
    [navigate]
  );

  // The write stays outside the updater: React may call an updater more than
  // once per dispatch, and updaters are expected to be pure.
  const toggleRail = useCallback(() => {
    const next = !railCollapsed;
    try {
      window.localStorage.setItem(RAIL_COLLAPSED_KEY, String(next));
    } catch {
      // A lost preference is not worth failing the interaction over.
    }
    setRailCollapsed(next);
  }, [railCollapsed]);

  const railWidth = railCollapsed ? RAIL_WIDTH_COLLAPSED : RAIL_WIDTH;

  return (
    <>
      <OnboardingProfileDialog
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onSkip={dismissOnboarding}
      />

      {/* Same gutter as the navbar, so the rail and content share its edges. */}
      <div className={SHELL}>
        {/* Mobile / tablet: the hamburger doubles as the current-section label */}
        <div className="flex items-center gap-2 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open dashboard menu"
            aria-expanded={navOpen}
            aria-controls={NAV_DRAWER_ID}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-colors hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">{activeLabel}</span>
          </button>
        </div>

        <Drawer
          id={NAV_DRAWER_ID}
          open={navOpen}
          onClose={() => setNavOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: "block",
            [`@media ${LG_QUERY}`]: { display: "none" },
            "& .MuiDrawer-paper": {
              width: RAIL_WIDTH,
              backgroundColor: "#161920",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "12px 8px",
            },
          }}
        >
          <div className="px-3 pb-2">
            <RailGreeting />
          </div>
          <DashboardNav activeRoute={activeRoute} onNavigate={handleNavigate} />
        </Drawer>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            minHeight: { xs: "auto", lg: "calc(100vh - 130px)" },
            gap: { xs: "8px", lg: "16px" },
          }}
        >
          {/* Desktop nav rail */}
          <Box
            className="hidden lg:block"
            sx={{
              width: { lg: `${railWidth}px` },
              flexShrink: 0,
              transition: "width 0.2s ease",
            }}
          >
            {/* Greeting and the collapse toggle share one row; collapsed, only
                the toggle remains. */}
            <div
              className={`flex items-center gap-2 pb-2 pt-1 ${
                railCollapsed ? "justify-center" : "justify-between px-3"
              }`}
            >
              {!railCollapsed && <RailGreeting />}
              <Tooltip
                title={railCollapsed ? "Expand menu" : "Collapse menu"}
                placement="right"
                arrow
              >
                <button
                  type="button"
                  onClick={toggleRail}
                  aria-label={railCollapsed ? "Expand menu" : "Collapse menu"}
                  aria-expanded={!railCollapsed}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {railCollapsed ? (
                    <PanelLeftOpen className="h-5 w-5" />
                  ) : (
                    <PanelLeftClose className="h-5 w-5" />
                  )}
                </button>
              </Tooltip>
            </div>

            <DashboardNav
              activeRoute={activeRoute}
              onNavigate={handleNavigate}
              collapsed={railCollapsed}
            />
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              pl: { xs: 0, lg: 1.5 },
              maxHeight: { xs: "none", lg: "calc(100vh - 130px)" },
              overflowY: { xs: "visible", lg: "auto" },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              transition: "all 0.3s ease",
              borderLeft: { lg: "2px solid #1f2937" },
            }}
            className="text-white"
          >
            <Outlet />
          </Box>
        </Box>
      </div>
    </>
  );
}

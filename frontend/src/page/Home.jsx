// Home.js - dashboard shell: nav rail on desktop, slide-out drawer below lg

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DraftsIcon from "@mui/icons-material/Drafts";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LinkIcon from "@mui/icons-material/Link";
import SettingsIcon from "@mui/icons-material/Settings";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FileStackIcon, Menu } from "lucide-react";
import OnboardingProfileDialog from "@/components/OnboardingProfileDialog";
import { useUserProfile } from "@/hooks/useUserProfile";

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
    text: "Settings",
    icon: <SettingsIcon />,
    route: "settings",
    color: "#9ca3af",
  },
];

const SIDEBAR_WIDTH = 248;

/**
 * The dashboard navigation list. Rendered by both the permanent desktop rail
 * and the mobile drawer so the two can never drift apart.
 */
function DashboardNav({ activeRoute, onNavigate }) {
  return (
    <List className="space-y-1" sx={{ py: 0 }}>
      {MENU_ITEMS.map((item) => {
        const isActive = activeRoute === item.route;

        return (
          <ListItem key={item.route} disablePadding className="text-white">
            <ListItemButton
              onClick={() => onNavigate(item.route)}
              selected={isActive}
              sx={{
                borderRadius: "8px",
                transition: "all 0.2s ease",
                backgroundColor: isActive
                  ? "rgba(255, 255, 255, 0.08)"
                  : "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                "&.Mui-selected": { borderLeft: `4px solid ${item.color}` },
                padding: "9px 14px",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "32px",
                  color: item.color,
                  fontSize: "1.15rem",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.925rem",
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
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

  // First visit only: prompt for the sender details every invoice needs, once
  // storage has actually been read and once the user has not already skipped.
  useEffect(() => {
    if (profileLoading) return;
    setShowOnboarding(!hasProfile && !onboardingDismissed);
  }, [profileLoading, hasProfile, onboardingDismissed]);

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

  return (
    <>
      <OnboardingProfileDialog
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onSkip={dismissOnboarding}
      />

      <div className="px-3 sm:px-4 lg:px-6">
        {/* Mobile / tablet: the hamburger doubles as the current-section label */}
        <div className="flex items-center gap-2 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open dashboard menu"
            aria-expanded={navOpen}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-colors hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">{activeLabel}</span>
          </button>
        </div>

        <Drawer
          open={navOpen}
          onClose={() => setNavOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              backgroundColor: "#161920",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "12px 8px",
            },
          }}
        >
          <p className="px-3 pb-2 text-sm text-white">
            Welcome <span className="font-medium text-green-400">Back!</span>
          </p>
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
            sx={{ width: { lg: `${SIDEBAR_WIDTH}px` }, flexShrink: 0 }}
          >
            <p className="px-3 pb-2 pt-1 text-base text-white">
              Welcome <span className="font-medium text-green-400">Back!</span>
            </p>
            <DashboardNav
              activeRoute={activeRoute}
              onNavigate={handleNavigate}
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

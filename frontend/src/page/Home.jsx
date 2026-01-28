// Home.js - Updated with Batch Creation AND Batch Payment sections
import * as React from "react";
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
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FileStack, CreditCard, Layers3, PlusCircle, FileStackIcon } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current active route for dropdown
  const getCurrentRoute = () => {
    const currentPath = location.pathname;
    const matchedItem = menuItems.find(item => currentPath.includes(item.route));
    return matchedItem ? matchedItem.route : 'create';
  };

  const handleDropdownChange = (event) => {
    navigate(event.target.value);
  };

  const menuItems = [
    {
      text: "Send Invoice",
      icon: <AddCircleOutlineIcon />,
      route: "create",
      color: "#f472b6",
    },
    {
      text: "Send Multiple Invoices",
      icon: <FileStackIcon/>,
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
  ];

  return (
    <>
      <div className="px-2 sm:px-4 md:px-6 lg:px-10">
        <header className="mb-2">
          <h1 className="text-xl sm:text-2xl mt-4 text-white">
            Welcome <span className="font-medium text-green-400">Back!</span>
          </h1>
        </header>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            minHeight: { xs: "auto", lg: "calc(100vh - 180px)" },
            gap: { xs: "12px", sm: "24px" },
          }}
        >
          {/* Mobile Dropdown Menu */}
          <Box
            className="lg:hidden"
            sx={{
              width: "100%",
              flexShrink: 0,
            }}
          >
            <FormControl fullWidth>
              <Select
                value={getCurrentRoute()}
                onChange={handleDropdownChange}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "white",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#1f2937",
                      color: "white",
                      "& .MuiMenuItem-root": {
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem key={item.route} value={item.route}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ color: item.color, display: "flex", alignItems: "center" }}>
                        {item.icon}
                      </Box>
                      <span>{item.text}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Desktop Vertical Menu */}
          <Box
            className="hidden lg:block"
            sx={{
              width: { lg: "264px" },
              flexShrink: 0,
            }}
          >
            <Drawer
              variant="permanent"
              sx={{
                "& .MuiDrawer-paper": {
                  width: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  position: "relative",
                  height: "auto",
                  top: 0,
                  zIndex: 1,
                },
              }}
            >
              <List className="space-y-2">
                {menuItems.map((item) => (
                  <ListItem
                    key={item.route}
                    disablePadding
                    className="text-white"
                  >
                    <ListItemButton
                      onClick={() => navigate(item.route)}
                      selected={location.pathname.includes(item.route)}
                      sx={{
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        backgroundColor: location.pathname.includes(item.route)
                          ? "rgba(255, 255, 255, 0.08)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                        },
                        "&.Mui-selected": {
                          borderLeft: "4px solid " + item.color,
                        },
                        padding: "12px 16px",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "36px",
                          color: item.color,
                          fontSize: "1.25rem",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: "1rem",
                          fontWeight: location.pathname.includes(item.route)
                            ? 600
                            : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              px: { xs: 0, sm: 1 },
              maxHeight: { xs: "none", lg: "calc(100vh - 180px)" },
              overflowY: { xs: "visible", lg: "auto" },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
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

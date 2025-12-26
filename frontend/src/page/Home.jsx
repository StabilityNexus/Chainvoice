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
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FileStack, CreditCard, Layers3, PlusCircle, FileStackIcon } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Sent Requests",
      icon: <MailOutlineIcon />,
      route: "sent",
      color: "#4ade80",
    },
    {
      text: "Received Requests",
      icon: <DraftsIcon />,
      route: "pending",
      color: "#60a5fa",
    },
    {
      text: "New Invoice",
      icon: <AddCircleOutlineIcon />,
      route: "create",
      color: "#f472b6",
    },
    {
      text: "Generate Link",
      icon: <LinkIcon />,
      route: "generate-link",
      color: "#a78bfa",
    },
    {
      text: "Batch Create",
      icon: <FileStackIcon/>,
      route: "batch-invoice",
      color: "#22c55e",
    },
  ];

  return (
    <>
      <div className="px-10">
        <header className="mb-2">
          <h1 className="text-2xl mt-4 text-white">
            Welcome <span className="font-medium text-green-400">Back!</span>
          </h1>
        </header>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            minHeight: "calc(100vh - 180px)",
            gap: "24px",
          }}
        >
          <Box
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
              px: 1,
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
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

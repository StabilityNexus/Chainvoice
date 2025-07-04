// Home.js
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
import { Outlet, useNavigate, useLocation } from "react-router-dom";

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
  ];

  return (
    <div className="px-10">
      <header className="">
        {" "}
        <h1 className="text-2xl mb-2 text-white">
          {" "}
          Welcome <span className="font-medium text-green-400">Back!</span>
        </h1>
      </header>

      <Box sx={{ display: "flex", minHeight: "calc(100vh - 180px)" }}>
        {/* Sidebar Navigation */}
        <nav className="lg:w-64 flex-shrink-0 pr-6">
          {" "}
          {/* Added right padding */}
          <Drawer
            variant="permanent"
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
                border: "none",
                backgroundColor: "transparent",
                position: "relative",
                height: "auto",
                top: 0, // Ensure it stays at top
              },
            }}
          >
            <List className="space-y-2">
              {" "}
              {/* Increased spacing */}
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
                      borderRadius: "8px", // Slightly larger radius
                      transition: "all 0.2s ease",
                      backgroundColor: location.pathname.includes(item.route)
                        ? "rgba(255, 255, 255, 0.08)" // Darker selected state
                        : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        transform: "translateX(4px)", // Nice hover effect
                      },
                      "&.Mui-selected": {
                        borderLeft: `4px solid ${item.color}`, // Thicker border
                      },
                      padding: "12px 16px", // More padding
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "36px",
                        color: item.color,
                        fontSize: "1.25rem", // Larger icons
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "1rem", // Slightly larger text
                        fontWeight: location.pathname.includes(item.route)
                          ? 600 // Bolder selected text
                          : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
        </nav>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            transition: "all 0.3s ease",
          }}
          className="text-white border-l-2 border-gray-800"
        >
          <Outlet />
        </Box>
      </Box>
    </div>
  );
}

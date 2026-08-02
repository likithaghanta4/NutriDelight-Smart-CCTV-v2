import React from "react";
import { NavLink } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SvgIcon from "@mui/material/SvgIcon";

const drawerWidth = 260;

function BrandCameraIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M9 4a2 2 0 0 0-2 2v1H5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3h-2V6a2 2 0 0 0-2-2H9zm5 3H9V6h5v1zm-1 5.5A3.5 3.5 0 1 1 9.5 9 3.5 3.5 0 0 1 13 12.5zm-2 0A1.5 1.5 0 1 0 9.5 14 1.5 1.5 0 0 0 11 12.5z" />
    </SvgIcon>
  );
}

function DashboardIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z" />
    </SvgIcon>
  );
}

function VisitorsIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0H5zm15-9a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm2 9v-1a6.98 6.98 0 0 0-4.12-6.39A5.5 5.5 0 0 1 20.5 18H22z" />
    </SvgIcon>
  );
}

function VehicleIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M5 11 6.5 7.5A2 2 0 0 1 8.34 6.2h7.32A2 2 0 0 1 17.5 7.5L19 11v6a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H10a2 2 0 0 1-4 0H5a1 1 0 0 1-1-1v-6zm2.3 0h9.4l-.9-2.3a.5.5 0 0 0-.46-.3H8.66a.5.5 0 0 0-.46.3L7.3 11zM9 16.5a1.5 1.5 0 1 0 0-.01v.01zm8 0a1.5 1.5 0 1 0 0-.01v.01z" />
    </SvgIcon>
  );
}

function SettingsIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M19.14 12.94a7.78 7.78 0 0 0 .05-.94 7.78 7.78 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.04 7.04 0 0 0-1.63-.94L14.3 2.9a.5.5 0 0 0-.49-.4h-3.84a.5.5 0 0 0-.49.4l-.36 2.44a7.04 7.04 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.58 8.86a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.62-.05.94s.02.63.05.94L2.7 14.54a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.37 1.04.69 1.63.94l.36 2.44a.5.5 0 0 0 .49.4h3.84a.5.5 0 0 0 .49-.4l.36-2.44c.59-.25 1.13-.57 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
    </SvgIcon>
  );
}

const navItems = [
  { label: "Dashboard", path: "", icon: DashboardIcon, end: true },
  { label: "Visitor Analytics", path: "visitor-analytics", icon: VisitorsIcon },
  { label: "Vehicle Analytics", path: "vehicle-analytics", icon: VehicleIcon },
  { label: "Settings", path: "settings", icon: SettingsIcon },
];

const buildNavPath = (basePath, path) => {
  const normalizedBasePath = basePath ? basePath.replace(/\/$/, "") : "";

  if (!path) {
    return normalizedBasePath || "/";
  }

  if (!normalizedBasePath) {
    return `/${path}`;
  }

  return `${normalizedBasePath}/${path}`;
};

function Sidebar({ open, closeSidebar, basePath = "" }) {
  const itemBaseStyles = {
    mb: 0.5,
    px: 1.75,
    py: 1.2,
    borderRadius: 2,
    color: "rgba(255,255,255,0.84)",
    transition:
      "transform 160ms ease, background-color 160ms ease, color 160ms ease, box-shadow 160ms ease",
    "&:hover": {
      transform: "translateX(4px)",
      backgroundColor: "rgba(255,255,255,0.08)",
      color: "#FFFFFF",
    },
    "&.active": {
      backgroundColor: "#1F5F4A",
      color: "#FFFFFF",
      boxShadow: "none",
      "& .MuiListItemIcon-root": {
        color: "#22C55E",
      },
    },
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={closeSidebar}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1E1E1E",
          color: "#FFFFFF",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, rgba(96,165,250,0.24), rgba(34,197,94,0.18))",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <BrandCameraIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, lineHeight: 1.1 }}
              >
                NutriDelight
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.68)", fontWeight: 500 }}
              >
                Smart CCTV
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
          <List disablePadding>
            {navItems.map(({ label, path, icon: Icon, end }) => (
              <ListItemButton
                key={label}
                component={NavLink}
                to={buildNavPath(basePath, path)}
                end={end}
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? "active" : "")}
                sx={itemBaseStyles}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 0.1,
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: 2 }}>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <List disablePadding sx={{ pt: 2 }}>
              <ListItemButton
                component="button"
                type="button"
                sx={{
                  ...itemBaseStyles,
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              ></ListItemButton>
            </List>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;

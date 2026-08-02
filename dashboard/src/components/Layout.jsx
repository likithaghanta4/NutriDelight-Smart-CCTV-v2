import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ basePath = "", appTitle, rightContent }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        overflow: "hidden",
        bgcolor: "#F8FAFC",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        closeSidebar={closeSidebar}
        basePath={basePath}
      />

      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Navbar
          toggleSidebar={toggleSidebar}
          appTitle={appTitle}
          rightContent={rightContent}
        />

        <Box
          component="main"
          sx={{
            width: "100%",
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;

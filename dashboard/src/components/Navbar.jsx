import { AppBar, Toolbar, Typography, Chip, IconButton } from "@mui/material";
import { FaVideo, FaBars } from "react-icons/fa";

function Navbar({ toggleSidebar, appTitle, rightContent }) {
  return (
    <AppBar
      position="sticky"
      sx={{
        background: "#0F172A",
        boxShadow: 3,
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 2,
      }}
    >
      <Toolbar>
        <IconButton
          onClick={toggleSidebar}
          edge="start"
          color="inherit"
          sx={{
            mr: 2,
          }}
        >
          <FaBars />
        </IconButton>

        <FaVideo size={28} color="#22C55E" />

        <Typography
          variant="h6"
          sx={{
            ml: 2,
            fontWeight: "bold",
            flexGrow: 1,
          }}
        >
          {appTitle || "NutriDelight Smart CCTV Analytics"}
        </Typography>

        {rightContent || (
          <Chip
            label="LIVE"
            color="success"
            sx={{
              fontWeight: "bold",
            }}
          />
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

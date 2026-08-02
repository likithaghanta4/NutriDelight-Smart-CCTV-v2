import { Paper, Typography, Box, Chip } from "@mui/material";
import { getOwnerStreamUrl, getShopStreamUrl } from "../lib/api";

function LiveCamera({ mode = "shop", ownerAccessToken = "" }) {
  const streamUrl =
    mode === "owner" ? getOwnerStreamUrl(ownerAccessToken) : getShopStreamUrl();

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 4,
        background: "#ffffff",
        border: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            📹 Live Camera Feed
          </Typography>

          <Typography color="text.secondary">
            Real-time AI monitoring powered by YOLOv11
          </Typography>
        </Box>

        <Chip
          label="LIVE"
          sx={{
            backgroundColor: "#ef4444",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
      </Box>

      {/* Live Stream */}
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: 3,
          backgroundColor: "#000",
          minHeight: 320,
        }}
      >
        {streamUrl ? (
          <img
            src={streamUrl}
            alt="Live Camera"
            style={{
              width: "100%",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              minHeight: 320,
              display: "grid",
              placeItems: "center",
              p: 2,
            }}
          >
            <Typography color="#fff" textAlign="center">
              Authenticating owner stream...
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default LiveCamera;

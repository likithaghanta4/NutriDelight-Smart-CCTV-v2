import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

function Settings() {
  const [cameraName, setCameraName] = useState("NutriDelight Entrance Camera");

  const [confidence, setConfidence] = useState(0.5);

  const [theme, setTheme] = useState("light");

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        backgroundColor: "#F8FAFC",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: "#0F172A",
          }}
        >
          Settings
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "#64748B",
          }}
        >
          Configure your Smart CCTV Analytics System
        </Typography>
      </Box>

      {/* System Settings */}

      <Card
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#0F172A",
              mb: 3,
            }}
          >
            System Settings
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 3,
            }}
          >
            <TextField
              label="Camera Name"
              value={cameraName}
              onChange={(e) => setCameraName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Confidence Threshold"
              type="number"
              value={confidence}
              inputProps={{
                min: 0,
                max: 1,
                step: 0.05,
              }}
              onChange={(e) => setConfidence(e.target.value)}
              fullWidth
            />

            <FormControl>
              <FormLabel>Theme</FormLabel>

              <RadioGroup
                row
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <FormControlLabel
                  value="light"
                  control={<Radio />}
                  label="Light"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      <Card
        elevation={0}
        sx={{
          mt: 4,
          borderRadius: "20px",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#0F172A",
              mb: 3,
            }}
          >
            About System
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2,1fr)",
                lg: "repeat(3,1fr)",
              },
              gap: 3,
            }}
          >
            <InfoCard title="AI Model" value="YOLOv11" color="#2563EB" />

            <InfoCard
              title="Frontend"
              value="React + Material UI"
              color="#22C55E"
            />

            <InfoCard
              title="Backend"
              value="Node.js + Express"
              color="#F59E0B"
            />

            <InfoCard title="Database" value="Supabase" color="#8B5CF6" />

            <InfoCard title="Version" value="1.0.0" color="#EF4444" />

            <InfoCard title="Status" value="Running" color="#050505" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
function InfoCard({ title, value, color }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "18px",
        border: "1px solid rgba(15,23,42,0.08)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
        },
      }}
    >
      <CardContent>
        <Typography
          sx={{
            color: "#64748B",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: 22,
            fontWeight: 800,
            color: color,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Settings;

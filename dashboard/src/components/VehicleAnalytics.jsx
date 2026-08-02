import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Card, Chip } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { apiEndpoints } from "../lib/api";

const cards = [
  {
    title: "Cars",
    value: 24,
    color: "#3B82F6",
    icon: <DirectionsCarIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "Motorcycles",
    value: 16,
    color: "#F59E0B",
    icon: <TwoWheelerIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "Buses",
    value: 5,
    color: "#8B5CF6",
    icon: <AirportShuttleIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "Trucks",
    value: 8,
    color: "#EF4444",
    icon: <LocalShippingIcon sx={{ fontSize: 36 }} />,
  },
];

const livePulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.35); }
  70% { transform: scale(1.02); box-shadow: 0 0 0 12px rgba(37, 99, 235, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
`;

function VehicleAnalytics() {
  const [vehicleData, setVehicleData] = useState({
    cars: 0,
    motorcycles: 0,
    buses: 0,
    trucks: 0,
  });
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchVehicleAnalytics = async () => {
      try {
        setLoading(true);

        await Promise.all([
          (async () => {
            const response = await fetch(apiEndpoints.vehicleAnalytics, {
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error("Failed to load vehicle analytics");
            }

            const data = await response.json();
            setVehicleData({
              cars: Number(data.cars ?? 0),
              motorcycles: Number(data.motorcycles ?? 0),
              buses: Number(data.buses ?? 0),
              trucks: Number(data.trucks ?? 0),
            });
          })(),
          (async () => {
            const response = await fetch(apiEndpoints.vehicleHourlyAnalytics, {
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error("Failed to load hourly vehicle analytics");
            }

            const data = await response.json();
            setHourlyData(Array.isArray(data) ? data : []);
          })(),
        ]);
      } catch (error) {
        if (error.name !== "AbortError") {
          setVehicleData({
            cars: 0,
            motorcycles: 0,
            buses: 0,
            trucks: 0,
          });
          setHourlyData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleAnalytics();

    return () => controller.abort();
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#F8FAFC",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h3" fontWeight="bold" color="#0F172A">
        Vehicle Analytics
      </Typography>

      <Typography
        sx={{
          color: "#64748B",
          mb: 5,
        }}
      >
        Real-time AI vehicle monitoring dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                p: 3,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                cursor: "pointer",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography color="text.secondary" fontWeight={600}>
                    {card.title}
                  </Typography>

                  <Typography variant="h3" fontWeight="bold">
                    {loading
                      ? "Loading..."
                      : card.title === "Cars"
                        ? vehicleData.cars
                        : card.title === "Motorcycles"
                          ? vehicleData.motorcycles
                          : card.title === "Buses"
                            ? vehicleData.buses
                            : vehicleData.trucks}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 3,
                    background: `${card.color}20`,
                    color: card.color,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Card
        elevation={0}
        sx={{
          mt: 3,
          width: "100%",
          borderRadius: "24px",
          p: 4,
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: -0.5 }}
            >
              Vehicle Trend
            </Typography>
            <Typography sx={{ mt: 0.5, color: "#64748B" }}>
              Real-time vehicle detection over time
            </Typography>
          </Box>

          <Chip
            label="LIVE DATA"
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              px: 1.5,
              height: 34,
              borderRadius: 999,
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              fontWeight: 800,
              letterSpacing: 0.8,
              border: "1px solid rgba(37, 99, 235, 0.18)",
              animation: `${livePulse} 2.4s ease-in-out infinite`,
            }}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            height: { xs: 320, md: 420 },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={hourlyData}
              margin={{ top: 10, right: 24, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient
                  id="vehicleTrendStroke"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="time"
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 14,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
                }}
              />
              <Line
                type="monotone"
                dataKey="cars"
                stroke="url(#vehicleTrendStroke)"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#2563EB",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 7, stroke: "#2563EB", strokeWidth: 2 }}
                isAnimationActive
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            mt: 2.5,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#64748B", fontWeight: 600 }}
          >
            Last updated: Just now
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default VehicleAnalytics;

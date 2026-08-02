import { useEffect, useState } from "react";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import LiveCamera from "./LiveCamera";
import { apiEndpoints } from "../lib/api";

function Dashboard({ streamMode = "shop", ownerAccessToken = "" }) {
  const [stats, setStats] = useState({
    total_visitors: 0,
    current_inside: 0,
    entries: 0,
    exits: 0,
    people: 0,
    cars: 0,
    motorcycles: 0,
    buses: 0,
    trucks: 0,
  });

  useEffect(() => {
    const fetchData = () => {
      fetch(apiEndpoints.detections)
        .then((res) => res.json())
        .then((data) => {
          const latest = Array.isArray(data) ? data[0] : data;

          if (latest) {
            const nextStats = {
              total_visitors: latest.total_visitors ?? 0,
              current_inside: latest.current_inside ?? 0,
              entries: latest.entries ?? 0,
              exits: latest.exits ?? 0,
              people: latest.people ?? 0,
              cars: latest.cars ?? 0,
              motorcycles: latest.motorcycles ?? 0,
              buses: latest.buses ?? 0,
              trucks: latest.trucks ?? 0,
            };

            console.log("[frontend][dashboard] detection update:", nextStats);
            setStats(nextStats);
          }
        })
        .catch((err) => console.log(err));
    };

    fetchData();

    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  const summaryCards = [
    {
      title: "Total Visitors",
      value: stats.total_visitors,
      accent: "#22C55E",
      tint: "rgba(34, 197, 94, 0.12)",
      icon: VisitorsIcon,
    },
    {
      title: "Current Inside",
      value: stats.current_inside,
      accent: "#2563EB",
      tint: "rgba(37, 99, 235, 0.12)",
      icon: InsideIcon,
    },
    {
      title: "Entries",
      value: stats.entries,
      accent: "#F59E0B",
      tint: "rgba(245, 158, 11, 0.14)",
      icon: EntryIcon,
    },
    {
      title: "Exits",
      value: stats.exits,
      accent: "#EF4444",
      tint: "rgba(239, 68, 68, 0.12)",
      icon: ExitIcon,
    },
  ];

  const detections = [
    {
      label: "Person",
      value: stats.people,
      accent: "#22C55E",
      tint: "rgba(34, 197, 94, 0.10)",
      icon: PersonIcon,
    },
    {
      label: "Car",
      value: stats.cars,
      accent: "#2563EB",
      tint: "rgba(37, 99, 235, 0.10)",
      icon: CarIcon,
    },
    {
      label: "Motorcycle",
      value: stats.motorcycles,
      accent: "#F59E0B",
      tint: "rgba(245, 158, 11, 0.12)",
      icon: MotorcycleIcon,
    },
    {
      label: "Bus",
      value: stats.buses,
      accent: "#8B5CF6",
      tint: "rgba(139, 92, 246, 0.12)",
      icon: BusIcon,
    },
    {
      label: "Truck",
      value: stats.trucks,
      accent: "#EF4444",
      tint: "rgba(239, 68, 68, 0.12)",
      icon: TruckIcon,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        backgroundColor: "#F8FAFC",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        "@keyframes pulse": {
          "0%": {
            opacity: 1,
            transform: "scale(1)",
          },
          "50%": {
            opacity: 0.4,
            transform: "scale(1.4)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
          mb: 5,
        }}
      >
        {/* Left Side */}

        {/* Left Section */}

        <Card
          elevation={0}
          sx={{
            borderRadius: "22px",
            p: 4,
            background: "linear-gradient(135deg,#2563EB 0%,#1E3A8A 100%)",
            color: "white",
            boxShadow: "0 20px 40px rgba(37,99,235,.25)",
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              opacity: 0.9,
            }}
          >
            👋 Welcome Back
          </Typography>

          <Typography
            variant="h3"
            sx={{
              mt: 1,
              fontWeight: 900,
            }}
          >
            Smart CCTV Dashboard
          </Typography>

          <Typography
            sx={{
              mt: 2,
              opacity: 0.85,
            }}
          >
            Real-time AI Monitoring & Intelligent Analytics
          </Typography>
        </Card>

        {/* Right Section */}

        <Card
          elevation={0}
          sx={{
            borderRadius: "22px",
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            border: "1px solid rgba(15,23,42,.08)",
            boxShadow: "0 12px 30px rgba(15,23,42,.08)",
          }}
        >
          <Typography
            sx={{
              color: "#64748B",
              fontWeight: 700,
            }}
          >
            AI ENGINE
          </Typography>

          <Chip
            label="🟢 ONLINE"
            sx={{
              mt: 2,
              width: 120,
              bgcolor: "#DCFCE7",
              color: "#15803D",
              fontWeight: 700,
            }}
          />

          <Typography
            sx={{
              mt: 3,
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            YOLOv11
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              mt: 1,
            }}
          >
            Detection Engine Running
          </Typography>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(2,1fr)",

            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 3,
          width: "100%",
        }}
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              elevation={0}
              sx={{
                width: "100%",
                borderRadius: "18px",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
                boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
                transition:
                  "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 18px 38px rgba(15, 23, 42, 0.12)",
                  borderColor: "rgba(37, 99, 235, 0.16)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#64748B",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 2,
                        fontSize: { xs: 42, md: 50 },
                        fontWeight: 900,
                        lineHeight: 1,
                        color: "#0F172A",
                      }}
                    >
                      {card.value ?? 0}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: `linear-gradient(135deg, ${card.tint}, #FFFFFF)`,
                      boxShadow: `0 8px 24px ${card.tint}`,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 34,
                        color: card.accent,
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#94A3B8",
                      fontWeight: 600,
                    }}
                  >
                    Updated Just Now
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#22C55E",
                        animation: "pulse 1.8s infinite",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#22C55E",
                      }}
                    >
                      LIVE
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      <LiveCamera mode={streamMode} ownerAccessToken={ownerAccessToken} />

      <Card
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: "20px",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
              AI Detection Board
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: "#64748B" }}>
              Real-time object classification summary
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(5, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {detections.map((item) => {
              const Icon = item.icon;

              return (
                <Box
                  key={item.label}
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    p: 2.5,
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    backgroundColor: item.tint,
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 26px rgba(15, 23, 42, 0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      color: item.accent,
                      backgroundColor: "rgba(255,255,255,0.72)",
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: 24 }} />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#334155",
                      mb: 0.5,
                    }}
                  >
                    {item.label}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 34,
                      lineHeight: 1,
                      fontWeight: 900,
                      color: "#0F172A",
                      letterSpacing: -0.8,
                    }}
                  >
                    {item.value ?? 0}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function VisitorsIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0H5zm15-9a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm2 9v-1a6.98 6.98 0 0 0-4.12-6.39A5.5 5.5 0 0 1 20.5 18H22z" />
    </SvgIcon>
  );
}

function InsideIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 2 2 9h3v11h14V9h3L12 2zm5 16H7V8.2l5-3.5 5 3.5V18zm-6-1h2V11h-2v6zm-4 0h2v-3H7v3zm8 0h2v-5h-2v5z" />
    </SvgIcon>
  );
}

function EntryIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M11 5V2l-5 5 5 5V9h7V5h-7zm-6 8v4h7v3l5-5-5-5v3H5z" />
    </SvgIcon>
  );
}

function ExitIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M13 5V2l5 5-5 5V9H6V5h7zm5 8v4h-7v3l-5-5 5-5v3h7z" />
    </SvgIcon>
  );
}

function PersonIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0H5z" />
    </SvgIcon>
  );
}

function CarIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M5 11 6.5 7.5A2 2 0 0 1 8.34 6.2h7.32A2 2 0 0 1 17.5 7.5L19 11v6a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0h-2a2 2 0 0 1-4 0H5a1 1 0 0 1-1-1v-6zm2.3 0h9.4l-.9-2.3a.5.5 0 0 0-.46-.3H8.66a.5.5 0 0 0-.46.3L7.3 11zM9 16.5a1.5 1.5 0 1 0 0-.01v.01zm8 0a1.5 1.5 0 1 0 0-.01v.01z" />
    </SvgIcon>
  );
}

function MotorcycleIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M5 17a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm14 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 9h3l1 2h3l2-3h3v2h-2.1l-1.5 2H17l2 4h-2l-1.2-2.4H13l-1.1-2H10l-2 2H6l1-1.5L5.5 9H7z" />
    </SvgIcon>
  );
}

function BusIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M7 3h10a3 3 0 0 1 3 3v10a2 2 0 0 1-2 2h-1a2 2 0 0 1-4 0H11a2 2 0 0 1-4 0H6a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v2h12V6a1 1 0 0 0-1-1H7zm11 5H6v6h1a2 2 0 0 1 4 0h3a2 2 0 0 1 4 0h1v-6zm-9 1H7v2h2v-2zm5 0h-3v2h3v-2zm3 0h-2v2h2v-2z" />
    </SvgIcon>
  );
}

function TruckIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M3 7a2 2 0 0 1 2-2h9v6h2.5L19 14v3h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H3V7zm2 0v8h.1a2 2 0 0 1 3.8 0H14V7H5zm12 5h-1v2h3v-1l-2-1zM8 17a1 1 0 1 0 0 .01V17zm8 0a1 1 0 1 0 0 .01V17z" />
    </SvgIcon>
  );
}

export default Dashboard;

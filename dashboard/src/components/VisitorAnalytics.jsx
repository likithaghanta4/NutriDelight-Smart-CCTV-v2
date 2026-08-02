import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/material/styles";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FaArrowDown,
  FaArrowUp,
  FaCalendarDay,
  FaChartLine,
  FaClock,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa";
import { apiEndpoints } from "../lib/api";

const pageFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const hoverCardStyles = {
  transition:
    "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
  },
};

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
}

function MetricCard({ title, value, icon: Icon, accent, tint }) {
  const animatedValue = useCountUp(Number(value ?? 0));

  return (
    <Card
      elevation={0}
      sx={{
        ...hoverCardStyles,
        borderRadius: "18px",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3.25, height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ color: "#64748B", fontSize: 14, fontWeight: 700, mb: 1 }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 34, md: 42 },
                lineHeight: 1,
                fontWeight: 900,
                color: "#0F172A",
                letterSpacing: -1.2,
              }}
            >
              {animatedValue}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              backgroundColor: tint,
              color: accent,
            }}
          >
            <Icon size={30} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function InsightRow({ icon: Icon, label, value, color }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        backgroundColor: "rgba(255,255,255,0.74)",
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          backgroundColor: color,
          color: "#FFFFFF",
        }}
      >
        <Icon size={18} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#64748B" }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 900,
            color: "#0F172A",
            letterSpacing: -0.5,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function VisitorAnalytics() {
  const [data, setData] = useState({
    summary: {
      total_visitors: 0,
      entries: 0,
      exits: 0,
      current_inside: 0,
    },
    hourly: [],
    daily: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(apiEndpoints.visitorAnalytics, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load visitor analytics");
        }

        const result = await response.json();
        setData({
          summary: result.summary ?? {
            total_visitors: 0,
            entries: 0,
            exits: 0,
            current_inside: 0,
          },
          hourly: Array.isArray(result.hourly) ? result.hourly : [],
          daily: Array.isArray(result.daily) ? result.daily : [],
        });
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Failed to load visitor analytics");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    return () => controller.abort();
  }, []);

  const { summary, hourly, daily } = data;

  const dailyChartData = useMemo(
    () =>
      daily.map((item) => ({
        ...item,
        visitors: Number(item.visitors ?? 0),
        entries: Number(item.entries ?? 0),
        exits: Number(item.exits ?? 0),
        inside: Number(item.inside ?? 0),
      })),
    [daily],
  );

  const hourlyChartData = useMemo(
    () =>
      hourly.map((item) => ({
        ...item,
        visitors: Number(item.visitors ?? 0),
      })),
    [hourly],
  );

  const analyticsStats = useMemo(() => {
    if (!dailyChartData.length) {
      return {
        peakDay: "-",
        highestVisitors: 0,
        lowestVisitors: 0,
        totalRecordedDays: 0,
      };
    }

    const peak = dailyChartData.reduce(
      (best, current) => (current.visitors > best.visitors ? current : best),
      dailyChartData[0],
    );
    const lowest = dailyChartData.reduce(
      (best, current) => (current.visitors < best.visitors ? current : best),
      dailyChartData[0],
    );

    return {
      peakDay: peak.date,
      highestVisitors: peak.visitors,
      lowestVisitors: lowest.visitors,
      totalRecordedDays: dailyChartData.length,
    };
  }, [dailyChartData]);

  const hasDailyData = dailyChartData.length > 0;
  const hasHourlyData = hourlyChartData.length > 0;
  const barColors = [
    "#2563EB",
    "#22C55E",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#14B8A6",
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
        animation: `${pageFadeIn} 420ms ease`,
      }}
    >
      <Box sx={{ mb: 4, width: "100%" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: -0.8,
            color: "#0F172A",
            lineHeight: 1.1,
          }}
        >
          Visitor Analytics
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "#64748B" }}>
          Monitor visitor trends and occupancy insights.
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            minHeight: "55vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {error ? (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {error}
            </Alert>
          ) : null}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 3,
              width: "100%",
            }}
          >
            <MetricCard
              title="Total Visitors"
              value={summary.total_visitors}
              icon={FaUsers}
              accent="#22C55E"
              tint="rgba(34, 197, 94, 0.12)"
            />
            <MetricCard
              title="Entries"
              value={summary.entries}
              icon={FaSignInAlt}
              accent="#2563EB"
              tint="rgba(37, 99, 235, 0.12)"
            />
            <MetricCard
              title="Exits"
              value={summary.exits}
              icon={FaSignOutAlt}
              accent="#F59E0B"
              tint="rgba(245, 158, 11, 0.14)"
            />
            <MetricCard
              title="Current Inside"
              value={summary.current_inside}
              icon={FaUserCheck}
              accent="#EF4444"
              tint="rgba(239, 68, 68, 0.12)"
            />
          </Box>

          <Card
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: "20px",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
              overflow: "hidden",
              ...hoverCardStyles,
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#0F172A" }}
                  >
                    Daily Visitor Trend
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: "#64748B" }}
                  >
                    Daily visitor patterns across recorded days
                  </Typography>
                </Box>
                <Chip
                  icon={<FaChartLine />}
                  label="ANALYTICS"
                  sx={{
                    height: 36,
                    px: 1,
                    fontWeight: 800,
                    letterSpacing: 0.8,
                    color: "#FFFFFF",
                    backgroundColor: "#0F172A",
                  }}
                />
              </Box>

              <Box sx={{ width: "100%", height: { xs: 300, md: 420 } }}>
                {hasDailyData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dailyChartData}
                      margin={{ top: 10, right: 24, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#64748B" }}
                        tickMargin={10}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#64748B" }}
                        tickMargin={10}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #E2E8F0",
                          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="visitors"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#2563EB" }}
                        activeDot={{ r: 6 }}
                        isAnimationActive
                        animationDuration={900}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      minHeight: 260,
                      borderRadius: 3,
                      border: "1px dashed rgba(100, 116, 139, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#64748B",
                      backgroundColor: "rgba(255,255,255,0.6)",
                    }}
                  >
                    No data available
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.15fr 0.85fr" },
              gap: 3,
              width: "100%",
            }}
          >
            <Card
              elevation={0}
              sx={{
                width: "100%",
                borderRadius: "20px",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                overflow: "hidden",
                ...hoverCardStyles,
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#0F172A" }}
                  >
                    Hourly Visitors
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: "#64748B" }}
                  >
                    Hour-by-hour visitor activity
                  </Typography>
                </Box>

                <Box sx={{ width: "100%", height: 320 }}>
                  {hasHourlyData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={hourlyChartData}
                        margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis
                          dataKey="hour"
                          tick={{ fontSize: 12, fill: "#64748B" }}
                          tickMargin={10}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#64748B" }}
                          tickMargin={10}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
                          }}
                        />
                        <Bar
                          dataKey="visitors"
                          radius={[10, 10, 0, 0]}
                          animationDuration={900}
                        >
                          {hourlyChartData.map((entry, index) => (
                            <Cell
                              key={`hourly-${entry.hour}-${index}`}
                              fill={barColors[index % barColors.length]}
                            />
                          ))}
                          <LabelList
                            dataKey="visitors"
                            position="top"
                            fill="#334155"
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        border: "1px dashed rgba(100, 116, 139, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        color: "#64748B",
                        backgroundColor: "rgba(255,255,255,0.6)",
                        textAlign: "center",
                        px: 2,
                      }}
                    >
                      <FaClock size={24} />
                      <Typography sx={{ fontWeight: 700, color: "#334155" }}>
                        No hourly data available
                      </Typography>
                      <Typography variant="body2">
                        Hourly insights will appear once data is available.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                width: "100%",
                borderRadius: "20px",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                overflow: "hidden",
                ...hoverCardStyles,
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#0F172A" }}
                  >
                    Statistics
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: "#64748B" }}
                  >
                    Key insights from recorded visitor days
                  </Typography>
                </Box>

                <Box sx={{ display: "grid", gap: 1.5 }}>
                  <InsightRow
                    icon={FaCalendarDay}
                    label="Peak visitor day"
                    value={analyticsStats.peakDay}
                    color="#2563EB"
                  />
                  <InsightRow
                    icon={FaArrowUp}
                    label="Highest visitors"
                    value={analyticsStats.highestVisitors}
                    color="#22C55E"
                  />
                  <InsightRow
                    icon={FaArrowDown}
                    label="Lowest visitors"
                    value={analyticsStats.lowestVisitors}
                    color="#F59E0B"
                  />
                  <InsightRow
                    icon={FaChartLine}
                    label="Total recorded days"
                    value={analyticsStats.totalRecordedDays}
                    color="#EF4444"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Card
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: "20px",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
              overflow: "hidden",
              ...hoverCardStyles,
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0F172A" }}
                >
                  Visitor History
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: "#64748B" }}>
                  Daily visitor record with entries, exits, and occupancy.
                </Typography>
              </Box>

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: "#0F172A" }}>
                        Date
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 800, color: "#0F172A" }}
                      >
                        Visitors
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 800, color: "#0F172A" }}
                      >
                        Entries
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 800, color: "#0F172A" }}
                      >
                        Exits
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 800, color: "#0F172A" }}
                      >
                        Current Inside
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dailyChartData.length > 0 ? (
                      dailyChartData.map((row) => (
                        <TableRow
                          key={row.date}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ color: "#334155", fontWeight: 700 }}
                          >
                            {row.date}
                          </TableCell>
                          <TableCell align="right">{row.visitors}</TableCell>
                          <TableCell align="right">{row.entries}</TableCell>
                          <TableCell align="right">{row.exits}</TableCell>
                          <TableCell align="right">{row.inside}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="center"
                          sx={{ py: 5, color: "#64748B" }}
                        >
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default VisitorAnalytics;

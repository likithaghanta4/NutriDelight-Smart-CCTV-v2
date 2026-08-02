import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function VisitorChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = () => {
      fetch("http://localhost:5000/api/detections")
        .then((res) => res.json())
        .then((data) => {
          const latest = data.slice(0, 10).reverse();

          const formatted = latest.map((item) => ({
            time: new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            visitors: item.total_visitors,
          }));

          setChartData(formatted);
        })
        .catch((err) => console.log(err));
    };

    fetchChartData();

    const interval = setInterval(fetchChartData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={5}
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 4,
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Live Visitor Trend
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default VisitorChart;

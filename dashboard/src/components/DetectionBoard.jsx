import { Paper, Typography, Box, Stack, Divider } from "@mui/material";
import { FaUser, FaCar, FaMotorcycle, FaBus, FaTruck } from "react-icons/fa";

function DetectionBoard({ stats }) {
  const detections = [
    {
      icon: <FaUser color="#22C55E" />,
      label: "Person",
      value: stats.people,
    },
    {
      icon: <FaCar color="#3B82F6" />,
      label: "Car",
      value: stats.cars,
    },
    {
      icon: <FaMotorcycle color="#F59E0B" />,
      label: "Motorcycle",
      value: stats.motorcycles,
    },
    {
      icon: <FaBus color="#8B5CF6" />,
      label: "Bus",
      value: stats.buses,
    },
    {
      icon: <FaTruck color="#EF4444" />,
      label: "Truck",
      value: stats.trucks,
    },
  ];

  return (
    <Paper
      elevation={5}
      sx={{
        p: 3,
        borderRadius: 4,
        height: "100%",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        AI Detection Board
      </Typography>

      <Stack spacing={2}>
        {detections.map((item) => (
          <Box key={item.label}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" gap={2}>
                {item.icon}
                <Typography>{item.label}</Typography>
              </Box>

              <Typography fontWeight="bold">{item.value ?? 0}</Typography>
            </Box>

            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </Stack>

      <Box mt={4}>
        <Typography color="green" fontWeight="bold">
          ● LIVE Detection
        </Typography>
      </Box>
    </Paper>
  );
}

export default DetectionBoard;

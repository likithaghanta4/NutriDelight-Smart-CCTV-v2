import { Card, CardContent, Typography } from "@mui/material";

function StatCard({ title, value, color }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        <Typography
          sx={{
            color: "gray",
            fontSize: 16,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: color,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StatCard;

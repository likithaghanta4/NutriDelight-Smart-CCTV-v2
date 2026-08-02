const supabase = require("../config/supabase");

const getVehicleAnalytics = async (req, res) => {
  const { data, error } = await supabase
    .from("detections")
    .select("cars, motorcycles, buses, trucks");

  if (error) {
    return res.status(500).json({
      message: "Failed to fetch vehicle analytics",
      error: error.message,
    });
  }

  const totals = Array.isArray(data)
    ? data.reduce(
        (accumulator, row) => {
          accumulator.cars += Number(row.cars ?? 0);
          accumulator.motorcycles += Number(row.motorcycles ?? 0);
          accumulator.buses += Number(row.buses ?? 0);
          accumulator.trucks += Number(row.trucks ?? 0);
          return accumulator;
        },
        {
          cars: 0,
          motorcycles: 0,
          buses: 0,
          trucks: 0,
        },
      )
    : {
        cars: 0,
        motorcycles: 0,
        buses: 0,
        trucks: 0,
      };

  return res.json(totals);
};

const getHourlyVehicleAnalytics = async (req, res) => {
  const { data, error } = await supabase
    .from("detections")
    .select("created_at, cars, motorcycles, buses, trucks");

  if (error) {
    return res.status(500).json({
      message: "Failed to fetch hourly vehicle analytics",
      error: error.message,
    });
  }

  const hourlyTotals = Array.from({ length: 24 }, (_, index) => ({
    hour: `${String(index).padStart(2, "0")}:00`,
    cars: 0,
    motorcycles: 0,
    buses: 0,
    trucks: 0,
  }));

  if (Array.isArray(data)) {
    data.forEach((row) => {
      const timestamp = row.created_at ? new Date(row.created_at) : null;

      if (!timestamp || Number.isNaN(timestamp.getTime())) {
        return;
      }

      const hourIndex = timestamp.getHours();
      const bucket = hourlyTotals[hourIndex];

      bucket.cars += Number(row.cars ?? 0);
      bucket.motorcycles += Number(row.motorcycles ?? 0);
      bucket.buses += Number(row.buses ?? 0);
      bucket.trucks += Number(row.trucks ?? 0);
    });
  }

  return res.json(hourlyTotals);
};

module.exports = {
  getVehicleAnalytics,
  getHourlyVehicleAnalytics,
};

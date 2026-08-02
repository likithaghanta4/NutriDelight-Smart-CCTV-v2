const supabase = require("../config/supabase");

const getVisitorAnalytics = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const { data: todayData, error: todayError } = await supabase
    .from("daily_statistics")
    .select("total_visitors, entries, exits, current_inside")
    .eq("stat_date", today)
    .limit(1);

  if (todayError) {
    return res.status(500).json({
      message: "Failed to fetch visitor analytics",
      error: todayError.message,
    });
  }

  const { data: dailyData, error: dailyError } = await supabase
    .from("daily_statistics")
    .select("stat_date, total_visitors, entries, exits, current_inside")
    .order("stat_date", { ascending: true });

  if (dailyError) {
    return res.status(500).json({
      message: "Failed to fetch visitor analytics",
      error: dailyError.message,
    });
  }

  const record =
    Array.isArray(todayData) && todayData.length > 0 ? todayData[0] : null;

  return res.json({
    summary: {
      total_visitors: record?.total_visitors ?? 0,
      entries: record?.entries ?? 0,
      exits: record?.exits ?? 0,
      current_inside: record?.current_inside ?? 0,
    },
    hourly: [],
    daily: Array.isArray(dailyData)
      ? dailyData.map((row) => ({
          date: row.stat_date,
          visitors: row.total_visitors,
          entries: row.entries,
          exits: row.exits,
          inside: row.current_inside,
        }))
      : [],
  });
};

module.exports = {
  getVisitorAnalytics,
};

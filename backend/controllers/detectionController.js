const supabase = require("../config/supabase");

const countFields = ["person", "car", "motorcycle", "bus", "truck"];
const visitorCountFields = [
  "total_visitors",
  "current_inside",
  "entries",
  "exits",
];

const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= 0;

const createDetection = async (req, res) => {
  const payload = req.body || {};

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({
      message: "Detection payload is required",
    });
  }

  const normalizedPayload = {
    ...payload,
  };
  console.log("[backend][detections] payload received:", normalizedPayload);
  if (
    normalizedPayload.person === undefined &&
    normalizedPayload.people !== undefined
  ) {
    normalizedPayload.person = normalizedPayload.people;
  }
  if (
    normalizedPayload.total_visitors === undefined &&
    normalizedPayload.totalVisitors !== undefined
  ) {
    normalizedPayload.total_visitors = normalizedPayload.totalVisitors;
  }

  if (
    normalizedPayload.current_inside === undefined &&
    normalizedPayload.currentInside !== undefined
  ) {
    normalizedPayload.current_inside = normalizedPayload.currentInside;
  }
  const missingFields = [...countFields, ...visitorCountFields].filter(
    (field) => normalizedPayload[field] === undefined,
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required detection fields: ${missingFields.join(", ")}`,
    });
  }

  const invalidCountField = [...countFields, ...visitorCountFields].find(
    (field) => !isNonNegativeInteger(normalizedPayload[field]),
  );

  if (invalidCountField) {
    return res.status(400).json({
      message: `Invalid value for ${invalidCountField}; expected a non-negative integer`,
    });
  }

  if (
    typeof normalizedPayload.camera !== "string" ||
    normalizedPayload.camera.trim().length === 0
  ) {
    return res.status(400).json({
      message: "Invalid value for camera; expected a non-empty string",
    });
  }

  if (
    typeof normalizedPayload.timestamp !== "string" ||
    Number.isNaN(Date.parse(normalizedPayload.timestamp))
  ) {
    return res.status(400).json({
      message: "Invalid value for timestamp; expected an ISO 8601 string",
    });
  }

  const detectionRow = {
    people: normalizedPayload.person,
    cars: normalizedPayload.car,
    motorcycles: normalizedPayload.motorcycle,
    buses: normalizedPayload.bus,
    trucks: normalizedPayload.truck,
    total_visitors: normalizedPayload.total_visitors,
    current_inside: normalizedPayload.current_inside,
    entries: normalizedPayload.entries,
    exits: normalizedPayload.exits,

    camera: normalizedPayload.camera.trim(),
    created_at: normalizedPayload.timestamp,
  };

  console.log("[backend][detections] normalized payload:", {
    total_visitors: normalizedPayload.total_visitors,
    current_inside: normalizedPayload.current_inside,
    entries: normalizedPayload.entries,
    exits: normalizedPayload.exits,
  });
  console.log("[backend][detections] row to insert:", detectionRow);

  const { data, error } = await supabase
    .from("detections")
    .insert([detectionRow])
    .select();

  if (error) {
    console.log("[backend][detections] supabase insert error:", error);

    return res.status(500).json({
      message: "Failed to store detection data",
      error: error.message,
    });
  }

  const today = normalizedPayload.timestamp.split("T")[0];

  const { data: existingStats, error: statsLookupError } = await supabase
    .from("daily_statistics")
    .select("*")
    .eq("stat_date", today)
    .single();

  if (statsLookupError && statsLookupError.code !== "PGRST116") {
    console.log("[backend][detections] daily stats lookup error:", statsLookupError);
    return res.status(500).json({
      message: "Failed to sync daily statistics",
      error: statsLookupError.message,
    });
  }

  const statsRow = {
    total_visitors: normalizedPayload.total_visitors,
    current_inside: normalizedPayload.current_inside,
    entries: normalizedPayload.entries,
    exits: normalizedPayload.exits,
  };

  if (existingStats) {
    const { error: updateError } = await supabase
      .from("daily_statistics")
      .update({
        ...statsRow,
        updated_at: new Date().toISOString(),
      })
      .eq("stat_date", today);

    if (updateError) {
      console.log("[backend][detections] daily stats update error:", updateError);
      return res.status(500).json({
        message: "Failed to sync daily statistics",
        error: updateError.message,
      });
    }
  } else {
    const { error: insertStatsError } = await supabase.from("daily_statistics").insert([
      {
        stat_date: today,
        ...statsRow,
      },
    ]);

    if (insertStatsError) {
      console.log("[backend][detections] daily stats insert error:", insertStatsError);
      return res.status(500).json({
        message: "Failed to sync daily statistics",
        error: insertStatsError.message,
      });
    }
  }

  console.log("[backend][detections] inserted detection row:", data?.[0] ?? null);
  console.log("[backend][detections] synced stats row:", statsRow);


  return res.status(201).json({
    message: "Detection data received successfully",
    total_visitors: normalizedPayload.total_visitors,
    current_inside: normalizedPayload.current_inside,
    entries: normalizedPayload.entries,
    exits: normalizedPayload.exits,
  });
};
const getLatestDetection = async (req, res) => {
  const { data, error } = await supabase
    .from("detections")
    .select("*")
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    return res.status(500).json({
      message: "Failed to fetch detection data",
      error: error.message,
    });
  }

  return res.json(data?.[0] ?? null);
};
const getTodayStatistics = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_statistics")
    .select("*")
    .eq("stat_date", today)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return res.json({
        stat_date: today,
        total_visitors: 0,
        current_inside: 0,
        entries: 0,
        exits: 0,
      });
    }

    return res.status(500).json({
      message: "Failed to fetch today's statistics",
      error: error.message,
    });
  }

  return res.json(data);
};
module.exports = {
  createDetection,
  getLatestDetection,
  getTodayStatistics,
};

const { Readable } = require("stream");
const env = require("../config/env");

const streamLiveCamera = async (req, res) => {
  const abortController = new AbortController();

  req.on("close", () => {
    abortController.abort();
  });

  try {
    const upstreamResponse = await fetch(env.aiStreamUrl, {
      method: "GET",
      signal: abortController.signal,
      headers: {
        Accept: "multipart/x-mixed-replace",
      },
    });

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      return res.status(502).json({
        message: "Live stream service is unavailable",
      });
    }

    const contentType =
      upstreamResponse.headers.get("content-type") ||
      "multipart/x-mixed-replace; boundary=frame";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const nodeStream = Readable.fromWeb(upstreamResponse.body);

    nodeStream.on("error", () => {
      if (!res.headersSent) {
        res.status(502).end();
      }
    });

    nodeStream.pipe(res);
    return undefined;
  } catch (error) {
    if (error.name === "AbortError") {
      return undefined;
    }

    return res.status(502).json({
      message: "Unable to connect to live stream service",
      error: error.message,
    });
  }
};

module.exports = {
  streamLiveCamera,
};

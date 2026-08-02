import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { supabase } from "../lib/supabase";

const ownerEmailConstraint = (
  import.meta.env.VITE_OWNER_EMAIL || ""
).toLowerCase();

function OwnerLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(import.meta.env.VITE_OWNER_EMAIL || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const verifyExistingSession = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!isMounted) {
        return;
      }

      if (user) {
        const userEmail = (user.email || "").toLowerCase();

        if (!ownerEmailConstraint || userEmail === ownerEmailConstraint) {
          navigate("/owner", { replace: true });
          return;
        }

        await supabase.auth.signOut();
      }

      setCheckingSession(false);
    };

    verifyExistingSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (ownerEmailConstraint && normalizedEmail !== ownerEmailConstraint) {
      setErrorMessage(
        "This portal is restricted to the configured owner account.",
      );
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    setLoading(false);

    if (error || !data.session) {
      setErrorMessage(error?.message || "Owner login failed");
      return;
    }

    navigate(location.state?.from?.pathname || "/owner", { replace: true });
  };

  if (checkingSession) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background: "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 4,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
            Owner Portal
          </Typography>
          <Typography sx={{ mt: 1, color: "#64748B" }}>
            Secure remote monitoring for NutriDelight Smart CCTV Analytics.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, display: "grid", gap: 2.2 }}
          >
            <TextField
              label="Owner Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              autoComplete="email"
              required
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              autoComplete="current-password"
              required
            />

            {errorMessage ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : null}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 0.5,
                py: 1.2,
                fontWeight: 700,
                borderRadius: 2.5,
                backgroundColor: "#1D4ED8",
                "&:hover": {
                  backgroundColor: "#1E40AF",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default OwnerLogin;

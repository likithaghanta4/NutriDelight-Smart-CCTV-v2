import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { supabase } from "../lib/supabase";

const ownerEmailConstraint = (
  import.meta.env.VITE_OWNER_EMAIL || ""
).toLowerCase();

function OwnerProtectedRoute() {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setSession(data.session || null);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          backgroundColor: "#F8FAFC",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const email = (session?.user?.email || "").toLowerCase();

  if (!session || (ownerEmailConstraint && email !== ownerEmailConstraint)) {
    return (
      <Navigate
        to="/owner/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}

export default OwnerProtectedRoute;

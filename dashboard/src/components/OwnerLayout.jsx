import { Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { supabase } from "../lib/supabase";

function OwnerLayout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/owner/login", { replace: true });
  };

  return (
    <Layout
      basePath="/owner"
      appTitle="NutriDelight Owner Remote Monitoring"
      rightContent={
        <>
          <Chip
            label="OWNER"
            sx={{
              mr: 1.5,
              fontWeight: 700,
              color: "#0F172A",
              backgroundColor: "#DCFCE7",
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleSignOut}
            sx={{
              color: "#E2E8F0",
              borderColor: "rgba(226,232,240,0.6)",
              "&:hover": {
                borderColor: "#FFFFFF",
                backgroundColor: "rgba(255,255,255,0.06)",
              },
            }}
          >
            Sign Out
          </Button>
        </>
      }
    />
  );
}

export default OwnerLayout;

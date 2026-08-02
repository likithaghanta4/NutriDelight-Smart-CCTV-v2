import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { supabase } from "../lib/supabase";

function OwnerDashboard() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setAccessToken(data.session?.access_token || "");
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setAccessToken(nextSession?.access_token || "");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return <Dashboard streamMode="owner" ownerAccessToken={accessToken} />;
}

export default OwnerDashboard;

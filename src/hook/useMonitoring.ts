import { LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import { MONITORING_STATUS_KEY } from "../const";

export const useMonitoring = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    async function getMonitoringStatus() {
      const status = await LocalStorage.getItem<boolean>(MONITORING_STATUS_KEY);
      setIsMonitoring(status ?? false);
    }

    getMonitoringStatus();
  }, []);

  return { isMonitoring, setIsMonitoring };
};

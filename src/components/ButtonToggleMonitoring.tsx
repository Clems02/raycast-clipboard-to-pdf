import { Action, ActionPanel, Icon, List, LocalStorage } from "@raycast/api";
import { MONITORING_STATUS_KEY } from "../const";

export type ButtonToggleMonitoringProps = {
  isMonitoring: boolean;
  setIsMonitoring: (isMonitoring: boolean) => void;
};

export const ButtonToggleMonitoring = ({ isMonitoring, setIsMonitoring }: ButtonToggleMonitoringProps) => {
  return (
    <List.Item
      icon={isMonitoring ? Icon.CheckRosette : Icon.XMarkCircle}
      title={`Statut: ${isMonitoring ? "En cours d'utilisation" : "Arrêté"}`}
      subtitle="Cliquez pour changer l'état"
      actions={
        <ActionPanel>
          <Action
            title={isMonitoring ? "Arrêter La Surveillance" : "Démarrer La Surveillance"}
            onAction={async () => {
              const newStatus = !isMonitoring;
              await LocalStorage.setItem(MONITORING_STATUS_KEY, newStatus);
              setIsMonitoring(newStatus);
            }}
          />
        </ActionPanel>
      }
    />
  );
};

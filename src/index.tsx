import { List } from "@raycast/api";
import { ButtonClearClipboard } from "./components/ButtonClearClipboard";
import { ButtonGenerateFile } from "./components/ButtonGenerateFile";
import { ButtonToggleMonitoring } from "./components/ButtonToggleMonitoring";
import { ClipboardList } from "./components/ClipboardList";
import { useClipboard } from "./hook/useClipboard";
import { useMonitoring } from "./hook/useMonitoring";
import { ButtonOpenFolder } from "./components/ButtonOpenFolder";

export default function Command() {
  const { isMonitoring, setIsMonitoring } = useMonitoring();
  const { clipboard, setClipboard, deleteItem } = useClipboard(isMonitoring);

  return (
    <List>
      <List.Section title="Actions">
        <ButtonToggleMonitoring isMonitoring={isMonitoring} setIsMonitoring={setIsMonitoring} />
        <ButtonGenerateFile clipboard={clipboard} setIsMonitoring={setIsMonitoring} />
        <ButtonClearClipboard setClipboard={setClipboard} />
        <ButtonOpenFolder />
      </List.Section>
      <ClipboardList items={clipboard} onDelete={deleteItem} />
    </List>
  );
}

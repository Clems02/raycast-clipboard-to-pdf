import { Action, ActionPanel, Icon, List, LocalStorage } from "@raycast/api";
import { STORAGE_KEY } from "../const";
import { ClipboardEntry } from "../type";

export type ButtonClearClipboardProps = {
  setClipboard: (clipboard: ClipboardEntry[]) => void;
};

export const ButtonClearClipboard = ({ setClipboard }: ButtonClearClipboardProps) => {
  return (
    <List.Item
      icon={Icon.Trash}
      title="Vider l'historique"
      actions={
        <ActionPanel>
          <Action
            title="Vider L'historique"
            onAction={async () => {
              await LocalStorage.removeItem(STORAGE_KEY);
              setClipboard([]);
            }}
          />
        </ActionPanel>
      }
    />
  );
};

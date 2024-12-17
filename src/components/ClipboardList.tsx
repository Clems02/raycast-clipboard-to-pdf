import { Action, ActionPanel, List } from "@raycast/api";
import { ClipboardEntry } from "../type";

export type ClipboardListProps = {
  items: ClipboardEntry[];
  onDelete: (timestamp: number) => void;
};

export const ClipboardList = ({ items, onDelete }: ClipboardListProps) => {
  return (
    <List.Section
      title="Historique"
      subtitle={items.length === 0 ? "" : `${items.length} élément${items.length > 1 ? "s" : ""}`}
    >
      {items.length === 0 && <List.Item title="Aucun contenu dans l'historique..." />}
      {items.map((item) => (
        <List.Item
          key={item.timestamp}
          title={item.content}
          actions={
            <ActionPanel>
              <Action title="Supprimer" onAction={() => onDelete(item.timestamp)} />
            </ActionPanel>
          }
        />
      ))}
    </List.Section>
  );
};

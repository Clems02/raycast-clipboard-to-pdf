import { Action, ActionPanel, environment, Icon, List } from "@raycast/api";
import { exec } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

export const ButtonOpenFolder = () => {
  const extensionFolderPath = join(environment.supportPath, "generated-pdfs");
  if (!existsSync(extensionFolderPath)) return;

  return (
    <List.Item
      icon={Icon.Folder}
      title={`Ouvrir le dossier des PDF`}
      actions={
        <ActionPanel>
          <Action
            title={"Ouvrir Le Dossier Des Pdf"}
            onAction={async () => {
              exec(`open "${extensionFolderPath}"`);
            }}
          />
        </ActionPanel>
      }
    />
  );
};

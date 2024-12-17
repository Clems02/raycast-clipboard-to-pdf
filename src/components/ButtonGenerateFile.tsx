import { Action, ActionPanel, Form, Icon, List, popToRoot } from "@raycast/api";
import { ClipboardEntry } from "../type";
import { generateFile } from "../utils/file";

export type ButtonGenerateFileProps = {
  clipboard: ClipboardEntry[];
  setIsMonitoring: (isMonitoring: boolean) => void;
};

export const ButtonGenerateFile = ({ clipboard, setIsMonitoring }: ButtonGenerateFileProps) => {
  return (
    <List.Item
      title="Générer le fichier"
      icon={Icon.Document}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.Push
              title="Générer Le Fichier"
              icon={Icon.Document}
              target={
                <Form
                  actions={
                    <ActionPanel>
                      <Action.SubmitForm
                        title="Générer"
                        onSubmit={async (values) => {
                          await generateFile(clipboard, {
                            className: values.className,
                            numberOfItems: Math.ceil(clipboard.length / 2),
                            teacherName: values.teacherName,
                          });
                          setIsMonitoring(false);
                          await popToRoot();
                        }}
                      />
                    </ActionPanel>
                  }
                >
                  <Form.TextField
                    id="teacherName"
                    title="Nom de l'enseignant"
                    placeholder="Entrez le nom de l'enseignant"
                  />
                  <Form.TextField id="className" title="Classe" placeholder="Entrez le nom de la classe" />
                </Form>
              }
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};

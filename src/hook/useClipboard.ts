import { Clipboard, LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import { STORAGE_KEY } from "../const";
import { ClipboardEntry } from "../type";

export const useClipboard = (enabled: boolean) => {
  const [clipboard, setClipboard] = useState<ClipboardEntry[]>([]);

  useEffect(() => {
    async function getClipboardHistory() {
      const history = await LocalStorage.getItem<string>(STORAGE_KEY);
      setClipboard(history ? JSON.parse(history) : []);
    }

    getClipboardHistory();
  }, []);

  useEffect(() => {
    let lastContent = "";
    let timeoutId: NodeJS.Timeout;

    const clearClipboard = async () => {
      await Clipboard.clear();
    };

    const listenClipboard = async () => {
      const content = await Clipboard.readText();

      if (content && content !== lastContent) {
        setClipboard((prev) => {
          const newClipboard = [...prev, { content: content, timestamp: Date.now() }];

          LocalStorage.setItem(STORAGE_KEY, JSON.stringify(newClipboard));
          return newClipboard;
        });

        lastContent = content;
      }

      if (enabled) {
        timeoutId = setTimeout(listenClipboard, 1000);
      }
    };

    const startMonitoring = async () => {
      await clearClipboard();
      await listenClipboard();
    };

    if (enabled) {
      startMonitoring();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled, clipboard]);

  const deleteItem = (timestamp: number) => {
    setClipboard((prev) => {
      const newClipboard = prev.filter((item) => item.timestamp !== timestamp);
      LocalStorage.setItem(STORAGE_KEY, JSON.stringify(newClipboard));
      return newClipboard;
    });
  };

  return { clipboard, setClipboard, deleteItem };
};

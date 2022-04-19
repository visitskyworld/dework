import { useUploadFile } from "@dewo/app/containers/fileUploads/hooks";
import { message } from "antd";
import { EditorView } from "prosemirror-view";
import { KeyboardEvent } from "react";

export const keydownHandler = (v: EditorView, event: Event) => {
  const e = event as any as KeyboardEvent<HTMLDivElement>;
  if (e.shiftKey && e.key === "Enter") {
    const tr = v.state.tr.replaceSelectionWith(
      v.state.schema.nodes.br.create()
    );
    v.dispatch(tr);
    event.preventDefault();
    return true;
  }
  return false;
};

export const useDropHandler = () => {
  const uploadFile = useUploadFile();

  return (view: EditorView, e: Event) => {
    // Allow dropping files that are not images
    const event = e as unknown as DragEvent;

    if (!event?.dataTransfer?.items) return false;

    for (let i = 0; i < event.dataTransfer.items.length; i++) {
      const item = event.dataTransfer.items[i];

      // Prematurely stop, in order to allow normal image pasting
      if (item.type.startsWith("image/")) return false;

      if (item.kind === "file") {
        const file = item.getAsFile();
        if (!file) continue;

        const isLt40M = file.size / 1024 / 1024 < 40;
        if (!isLt40M) {
          message.error("File must be smaller than 40MB.");
          break;
        }

        uploadFile(file).then((url) => {
          const schema = view.state.schema;
          const node = schema.text(file.name || url, [
            schema.marks.link.create({ href: url, title: file.name }),
          ]);
          view.dispatch(view.state.tr.replaceSelectionWith(node, false));
        });
        break;
      }
    }

    // Stop from pasting the file as an image
    event.preventDefault();
    return true;
  };
};

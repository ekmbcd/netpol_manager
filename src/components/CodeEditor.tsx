import { useClusterStore } from "@/store/clusterStore";
import ReactCodeEditor from "@uiw/react-textarea-code-editor";
import { useState } from "react";
import { parse, stringify } from "yaml";

function CodeEditor() {
  const newNetpol = useClusterStore((state) => state.newNetpol);
  const setNewNetpol = useClusterStore((state) => state.setNewNetpol);

  const [code, setCode] = useState(stringify(newNetpol));

  function update(newCode: string) {
    setCode(newCode);
    try {
      const parsed = parse(newCode);
      setNewNetpol(parsed);
    } catch {
      // console.error(e);
    }
  }

  // console.log(code, parse(code));

  return (
    <ReactCodeEditor
      value={code}
      language="yaml"
      padding={16}
      onChange={(e) => update(e.target.value)}
      data-color-mode="light"
      style={{
        fontSize: 14,
      }}
    />
  );
}

export default CodeEditor;

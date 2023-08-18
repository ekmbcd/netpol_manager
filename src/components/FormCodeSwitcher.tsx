import { useState } from "react";
import CodeEditor from "./CodeEditor";
import DynamicForm from "./DynamicForm";
import TabsButton from "./TabsButton";

function FormCodeSwitcher() {
  const [view, setView] = useState<"form" | "code">("form");

  return (
    <div className="p-2 w-4/12 overflow-auto h-full">
      <div className="flex items-center justify-center gap-8 mb-2">
        <TabsButton
          value="form"
          label="Form"
          onClick={() => setView("form")}
          current={view}
        />
        <TabsButton
          value="code"
          label="Code"
          onClick={() => setView("code")}
          current={view}
        />
      </div>
      {view === "form" ? <DynamicForm /> : <CodeEditor />}
    </div>
  );
}

export default FormCodeSwitcher;

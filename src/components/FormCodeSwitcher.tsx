import { Tabs } from "@mantine/core";
import { useState } from "react";
import CodeEditor from "./CodeEditor";
import DynamicForm from "./DynamicForm";

function FormCodeSwitcher() {
  const [view, setView] = useState<"form" | "code">("form");

  return (
    <Tabs
      value={view}
      onChange={(e) => setView(e as "form" | "code")}
      keepMounted={false}
      className="flex h-full w-4/12 flex-col pb-2"
    >
      <Tabs.List
        justify="center"
        // TODO: hack for mantine bug, remove when fixed
        className="before:!bottom-0"
      >
        <Tabs.Tab value="form">Form</Tabs.Tab>
        <Tabs.Tab value="code">Code</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="form" className="grow overflow-auto pt-2">
        <DynamicForm />
      </Tabs.Panel>

      <Tabs.Panel value="code" className="grow overflow-auto pt-2">
        <CodeEditor />
      </Tabs.Panel>
    </Tabs>
  );
}

export default FormCodeSwitcher;

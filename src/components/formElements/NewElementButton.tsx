import { ActionIcon } from "@mantine/core";

type NewElementButtonProps = {
  onClick: () => void;
};

function NewElementButton({ onClick }: NewElementButtonProps) {
  return (
    <ActionIcon
      variant="filled"
      color="lime"
      radius="xl"
      p={2}
      size="sm"
      onClick={onClick}
      style={{ background: "var(--_ai-bg, var(--ai-bg))" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 5l0 14"></path>
        <path d="M5 12l14 0"></path>
      </svg>
    </ActionIcon>
  );
}

export default NewElementButton;

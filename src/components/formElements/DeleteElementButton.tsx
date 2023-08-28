import { ActionIcon } from "@mantine/core";

type DeleteElementButtonProps = {
  onClick: () => void;
};

function DeleteElementButton({ onClick }: DeleteElementButtonProps) {
  return (
    <ActionIcon
      variant="filled"
      color="red.7"
      radius="xl"
      size="sm"
      p={2}
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
        <path d="M5 12l14 0"></path>
      </svg>
    </ActionIcon>
  );
}

export default DeleteElementButton;

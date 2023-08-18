import classNames from "classnames";

type TabsButtonProps<T> = {
  value: T;
  label: string;
  current: string;
  onClick: (value: T) => void;
};

function TabsButton<T>({ value, label, current, onClick }: TabsButtonProps<T>) {
  return (
    <div
      className={classNames(
        "cursor-pointer border-blue-500 p-2 text-lg font-semibold",
        current === value && "border-b-2"
      )}
      onClick={() => onClick(value)}
    >
      {label}
    </div>
  );
}

export default TabsButton;

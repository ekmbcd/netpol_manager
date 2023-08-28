import { TextInput } from "@mantine/core";
import { forwardRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Autocomplete from "./Autocomplete";

type InputWithLabelProps = {
  label: string;
  onBlur?: (e: any) => void;
  onChange: (...event: any[]) => void;
  options?: string[];
  value: string | number;
};

// need to forward ref to input
const InputWithLabel = forwardRef(
  (
    { options, label, value, ...props }: InputWithLabelProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <div className="pb-1">
        <Label>
          {label}
          {options ? (
            <Autocomplete
              options={options}
              ref={ref}
              value={value as string}
              {...props}
            />
          ) : (
            <TextInput value={value} {...props} />
          )}
        </Label>
      </div>
    );
  }
);

export default InputWithLabel;

import { Input, InputProps } from "../ui/input";
import { Label } from "../ui/label";

type InputWithLabelProps = {
  label: string;
  type?: string;
  props?: InputProps & React.RefAttributes<HTMLInputElement>;
};

function InputWithLabel({ label, props, type = "text" }: InputWithLabelProps) {
  return (
    <div className="pb-2">
      <Label>
        {label}
        <Input type={type} {...props} />
      </Label>
    </div>
  );
}

export default InputWithLabel;

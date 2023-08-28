import { MatchExpression, NetworkPolicyFull } from "@/types";
import {
  addMatchExpression,
  removeMatchExpression,
  useFormContext,
} from "@/utils/form";
import { Path } from "@/utils/path";
import { Divider, Select, TagsInput, TextInput } from "@mantine/core";
import DeleteElementButton from "./DeleteElementButton";
import NewElementButton from "./NewElementButton";

type MatchExpressionsProps = {
  path: Path<NetworkPolicyFull>;
};

function MatchExpressions({ path }: MatchExpressionsProps) {
  const { getInputProps, setFieldValue } = useFormContext();

  const expressions: MatchExpression[] | undefined = getInputProps(path).value;

  if (!expressions) {
    return null;
  }

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <div className="flex justify-between pb-2">
        <h4 className="font-semibold text-slate-900">MatchExpressions</h4>
        <NewElementButton
          onClick={() => addMatchExpression(expressions, setFieldValue, path)}
        />
      </div>
      <div>
        {expressions.map((_, index) => (
          <div key={index}>
            <div className="flex gap-2 items-center">
              <div>
                <div className="flex gap-2 items-center">
                  <TextInput
                    required
                    label="key"
                    className="grow"
                    {...getInputProps(`${path}.${index}.key`)}
                  />
                  <Select
                    required
                    label="operator"
                    {...getInputProps(`${path}.${index}.operator`)}
                    data={["In", "NotIn", "Exists", "DoesNotExist"]}
                  />
                </div>

                <TagsInput
                  label="values"
                  {...getInputProps(`${path}.${index}.values`)}
                />
              </div>

              <DeleteElementButton
                onClick={() =>
                  removeMatchExpression(expressions, setFieldValue, path, index)
                }
              />
            </div>
            {index !== expressions.length - 1 && <Divider my="md" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchExpressions;

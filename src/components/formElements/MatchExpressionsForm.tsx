import { MatchExpression, NetworkPolicyFull } from "@/types";
import { addMatchExpression, removeMatchExpression } from "@/utils/form";
import { FieldPath, useFormContext } from "react-hook-form";
import DeleteElementButton from "./DeleteElementButton";
import NewElementButton from "./NewElementButton";

type MatchExpressionsProps = {
  path: FieldPath<NetworkPolicyFull>;
};

function MatchExpressions({ path }: MatchExpressionsProps) {
  const { watch, setValue } = useFormContext<NetworkPolicyFull>();

  const expressions = watch(path) as MatchExpression[] | undefined;

  if (!expressions) {
    return null;
  }

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <div className="flex justify-between pb-2">
        <h4 className="font-semibold text-slate-900">MatchExpressions</h4>
        <NewElementButton
          onClick={() => addMatchExpression(expressions, setValue, path)}
        />
      </div>
      <div>
        {expressions.map((expression, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div>{expression.key} aa</div>
            <DeleteElementButton
              onClick={() =>
                removeMatchExpression(expressions, setValue, path, index)
              }
            />
          </div>
        ))}

        {/* {labelsArray.map(([key, value], index) => {
          return (
            <div key={index} className="flex gap-2 items-center">
              <div className="grow">
                <InputWithLabel
                  label="key"
                  onChange={(e) => onChange(e, "key", key)}
                  value={key}
                  options={getLabels(LabelSource)}
                />
              </div>
              <div className="grow">
                <InputWithLabel
                  label="value"
                  onChange={(e) => onChange(e, "value", key)}
                  value={value}
                  options={getLabels(LabelSource, key)}
                />
              </div>
              <DeleteElementButton
                onClick={() => removeLabel(labels!, setValue, path, key)}
              />
            </div>
          );
        })} */}
      </div>
    </div>
  );
}

export default MatchExpressions;

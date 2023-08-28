import { NetworkPolicyFull, Policy, PolicySelectorType } from "@/types";
import {
  changePolicySelector,
  removePolicy,
  useFormContext,
} from "@/utils/form";
import { Path } from "@/utils/path";
import { Select } from "@mantine/core";
import DeleteElementButton from "./DeleteElementButton";
import SelectorForm from "./SelectorForm";

type PolicySelectorFormProps = {
  path: Path<NetworkPolicyFull>;
  index: number;
};

function PolicySelectorForm({ path, index }: PolicySelectorFormProps) {
  const { setFieldValue, getInputProps } = useFormContext();
  const policies: Policy[] = getInputProps(path).value;
  const policy = policies[index];

  let initialPolicy: PolicySelectorType;
  if ("namespaceSelector" in policy) {
    initialPolicy = PolicySelectorType.NamespaceSelector;
  } else if ("ipBlock" in policy) {
    initialPolicy = PolicySelectorType.ipBlock;
  } else {
    initialPolicy = PolicySelectorType.PodSelector;
  }

  function onSelectorChange(newType: PolicySelectorType) {
    if (newType === initialPolicy) {
      return false;
    }
    changePolicySelector(
      newType,
      `${path}.${index}` as Path<NetworkPolicyFull>,
      setFieldValue
    );
  }

  return (
    <div className="mb-4 border-l-2 border-slate-300 pl-2">
      <div className="flex items-center justify-between pb-2">
        {/* TODO: bug(?): if you select again the selected option, the input empties but the value stays */}
        <Select
          placeholder="Choose a Selector"
          onChange={onSelectorChange}
          data={[
            PolicySelectorType.PodSelector,
            PolicySelectorType.NamespaceSelector,
            PolicySelectorType.ipBlock,
          ]}
          value={initialPolicy}
          checkIconPosition="right"
        />
        <DeleteElementButton
          onClick={() => removePolicy(policies, setFieldValue, path, index)}
        />
      </div>

      {initialPolicy === PolicySelectorType.PodSelector && (
        <SelectorForm
          title="Pod Selector"
          path={`${path}.${index}.podSelector` as Path<NetworkPolicyFull>}
          LabelSource="pod"
        />
      )}

      {initialPolicy === PolicySelectorType.NamespaceSelector && (
        <SelectorForm
          title="Namespace Selector"
          path={`${path}.${index}.namespaceSelector` as Path<NetworkPolicyFull>}
          LabelSource="namespace"
        />
      )}

      {initialPolicy === PolicySelectorType.ipBlock && <div>ipblock form</div>}
    </div>
  );
}

export default PolicySelectorForm;

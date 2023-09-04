import { NamespaceSelector, Policy, PolicySelectorType } from "@/types";
import {
  changePolicySelector,
  removePolicy,
  togglePodSelectorToNamespaceSelector,
  useFormContext,
} from "@/utils/form";
import { NetworkPolicyPathExtract } from "@/utils/path";
import { Checkbox, Select } from "@mantine/core";
import DeleteElementButton from "./DeleteElementButton";
import IpBlockForm from "./IpBlockForm";
import SelectorForm from "./SelectorForm";

type PolicySelectorFormProps = {
  path: NetworkPolicyPathExtract<`${string}.from` | `${string}.to`>;
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
    changePolicySelector(`${path}.${index}`, setFieldValue, newType);
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
          onClick={() => removePolicy(path, setFieldValue, policies, index)}
        />
      </div>

      {initialPolicy === PolicySelectorType.PodSelector && (
        <SelectorForm
          title="Pod Selector"
          path={`${path}.${index}.podSelector`}
          LabelSource="pod"
        />
      )}

      {initialPolicy === PolicySelectorType.NamespaceSelector && (
        <>
          <SelectorForm
            title="Namespace Selector"
            path={`${path}.${index}.namespaceSelector`}
            LabelSource="namespace"
          />
          <Checkbox
            className="pb-2"
            label="Add podSelector"
            checked={"podSelector" in (policy as NamespaceSelector)}
            onChange={(e) =>
              togglePodSelectorToNamespaceSelector(
                `${path}.${index}`,
                setFieldValue,
                policy as NamespaceSelector,
                e.currentTarget.checked
              )
            }
          />

          {"podSelector" in (policy as NamespaceSelector) && (
            <SelectorForm
              title="Pod Selector"
              path={`${path}.${index}.podSelector`}
              LabelSource="pod"
            />
          )}
        </>
      )}
      {initialPolicy === PolicySelectorType.ipBlock && (
        <IpBlockForm path={`${path}.${index}.ipBlock`} />
      )}
    </div>
  );
}

export default PolicySelectorForm;

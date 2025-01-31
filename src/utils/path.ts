import { NetworkPolicyFull } from "@/types";

type Primitive = null | undefined | string | number | boolean | symbol | bigint;

type FindKey<
  Key extends string | number,
  Value,
  TraversedTypes,
> = Value extends Primitive
  ? `${Key}`
  : TraversedTypes extends Value
  ? `${Key}`
  : `${Key}` | `${Key}.${FindPaths<Value, TraversedTypes | Value>}`;

type FindPaths<Parent, TraversedTypes = Parent> = Parent extends Array<
  infer ArrayElement
>
  ? FindKey<number, ArrayElement, TraversedTypes>
  : {
      [Key in keyof Parent]-?: FindKey<
        Key & string,
        Parent[Key],
        TraversedTypes
      >;
    }[keyof Parent];

// Path<T> will be a union of all possible paths in T as a string literal type.
// For example:
// type Foo = {
//   a: string;
//   b: {
//     c: number;
//     d: boolean;
//   }[];
// };
// type FooPath = Path<Foo>;
// type FooPath = "a" | "b" | `b.${number}` | `b.${number}.c` | `b.${number}.d`
type Path<T> = T extends object ? FindPaths<T> : never;

export type NetworkPolicyPath = Path<NetworkPolicyFull>;

// extract from NetworkPolicyPath all paths that match PathString
export type NetworkPolicyPathExtract<PathString extends string> = Extract<
  NetworkPolicyPath,
  PathString
>;

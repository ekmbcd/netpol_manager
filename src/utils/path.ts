import { NetworkPolicyFull } from "@/types";

type Primitive = null | undefined | string | number | boolean | symbol | bigint;

type PathImpl<
  K extends string | number,
  V,
  TraversedTypes,
> = V extends Primitive
  ? `${K}`
  : TraversedTypes extends V
  ? `${K}`
  : `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`;

type PathInternal<T, TraversedTypes = T> = T extends ReadonlyArray<infer V>
  ? PathImpl<number, V, TraversedTypes>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>;
    }[keyof T];

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
type Path<T> = T extends any ? PathInternal<T> : never;

export type NetworkPolicyPath = Path<NetworkPolicyFull>;

// extract from NetworkPolicyPath all paths that match T
export type NetworkPolicyPathExtract<T> = Extract<NetworkPolicyPath, T>;

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

export type Path<T> = T extends any ? PathInternal<T> : never;

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
import { Combobox, Transition } from "@headlessui/react";
import classNames from "classnames";
import React, { Fragment, forwardRef } from "react";

type AutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: any) => void;
  options: string[];
};

const Autocomplete = forwardRef(
  (
    { options, value, onChange }: AutocompleteProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const filteredOptions =
      value === ""
        ? options
        : options.filter((person) =>
            person.toLowerCase().includes(value.toLowerCase())
          );

    return (
      // TODO: this onChange takes a string, but the onChange in the input takes an event
      <Combobox value={value} onChange={onChange}>
        {/* hack to avoid menu reopening after click on option */}
        <input className="hidden" />

        <div className="relative">
          <Combobox.Button as="div">
            <Combobox.Input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => onChange(e.target.value)}
              ref={ref}
            />
          </Combobox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
              {filteredOptions.length != 0 &&
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option}
                    className={({ active }) =>
                      classNames(
                        "cursor-default select-none relative py-2 pl-10 pr-4",
                        active
                          ? "text-white bg-teal-600 font-medium"
                          : "text-gray-900 font-normal"
                      )
                    }
                    value={option}
                  >
                    <span className={"block truncate"}>{option}</span>
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    );
  }
);

export default Autocomplete;

"use client";

import { Field, Input, Select, Textarea } from "@/components/ui";
import type { FormField } from "@/lib/types";

type DynamicFormFieldsProps = {
  fields: FormField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
};

function stringValue(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function arrayValue(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function isTextarea(field: FormField) {
  const key = field.field_key.toLowerCase();
  const type = field.input_type.toLowerCase();
  return type.includes("textarea") || key.includes("description") || key.includes("comment") || key.includes("case");
}

function isMulti(field: FormField) {
  const type = field.input_type.toLowerCase();
  return type.includes("multi") || type.includes("checkbox");
}

export function DynamicFormFields({ fields, values, onChange }: DynamicFormFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const wide = isTextarea(field) || isMulti(field) || field.options.length > 8;
        const value = values[field.field_key];
        return (
          <div key={field.field_key} className={wide ? "md:col-span-2" : ""}>
            <Field label={`${field.field_name}${field.required ? " *" : ""}`}>
              {field.options.length > 0 && isMulti(field) ? (
                <div className="grid max-h-64 gap-2 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2">
                  {field.options.map((option) => {
                    const selected = arrayValue(value).includes(option.code);
                    return (
                      <label
                        key={option.code}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                          selected ? "bg-emerald-50 text-emerald-800" : "hover:bg-zinc-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) => {
                            const current = arrayValue(value);
                            onChange(
                              field.field_key,
                              event.target.checked
                                ? [...current, option.code]
                                : current.filter((item) => item !== option.code),
                            );
                          }}
                          className="size-4 rounded border-zinc-300 text-emerald-600"
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              ) : field.options.length > 0 ? (
                <Select
                  required={field.required}
                  value={stringValue(value)}
                  onChange={(event) => onChange(field.field_key, event.target.value)}
                >
                  <option value="">Выберите значение</option>
                  {field.options.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : isTextarea(field) ? (
                <Textarea
                  required={field.required}
                  value={stringValue(value)}
                  onChange={(event) => onChange(field.field_key, event.target.value)}
                />
              ) : (
                <Input
                  required={field.required}
                  value={stringValue(value)}
                  onChange={(event) => onChange(field.field_key, event.target.value)}
                />
              )}
            </Field>
          </div>
        );
      })}
    </div>
  );
}

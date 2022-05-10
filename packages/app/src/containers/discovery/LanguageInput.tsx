import { Language } from "@dewo/app/graphql/types";
import { Row, Tag } from "antd";
import React, { FC, useCallback } from "react";

const options = [
  {
    value: Language.ENGLISH,
    label: "🇺🇸 English",
    color: "blue",
  },
  {
    value: Language.CHINESE,
    label: "🇨🇳 Chinese",
    color: "red",
  },
];

interface Props {
  value?: string[];
  onChange?(value: string[]): void;
}

export const LanguageInput: FC<Props> = ({ value, onChange }) => {
  const handleClick = useCallback(
    (language: Language) =>
      onChange?.(
        !!value?.includes(language)
          ? value.filter((l) => l !== language)
          : [...(value ?? []), language]
      ),
    [value, onChange]
  );
  return (
    <Row gutter={[4, 8]} style={{ marginBottom: 16 }}>
      {options.map((option) => {
        const selected = !!value?.includes(option.value);
        return (
          <Tag
            key={option.value}
            color={selected ? option.color : undefined}
            children={option.label}
            className="hover:cursor-pointer"
            style={{
              opacity: !!value?.length && !selected ? 0.5 : undefined,
            }}
            onClick={() => handleClick(option.value)}
          />
        );
      })}
    </Row>
  );
};

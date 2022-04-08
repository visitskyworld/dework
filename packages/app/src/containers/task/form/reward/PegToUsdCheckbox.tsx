import React, { FC } from "react";
import { Checkbox, Tooltip, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import _ from "lodash";
import { TaskRewardFormValues } from "../types";

export async function validator(
  _rule: unknown, // RuleObject,
  value: Partial<TaskRewardFormValues> | undefined
) {
  if (!value || _.isEmpty(value)) return;
  if (!value.networkId) return;
  if (!value.amount) return;

  if (!value.token) throw new Error("Please enter a token");
}

interface Props {
  value: Partial<TaskRewardFormValues>;
  onChange(checked: boolean): void;
}

export const PegToUsdCheckbox: FC<Props> = ({ value, onChange }) => {
  const disabled = !!value.token && !value.token?.usdPrice;
  const checkbox = (
    <Checkbox
      checked={value.peggedToUsd}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    >
      Peg to USD
      {!disabled && (
        <Tooltip
          placement="bottom"
          title="If checked, the reward will be set in USD and converted to the equivalent amount of the selected token at the time of payment."
        >
          <Icons.QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Tooltip>
      )}
      {!!value.peggedToUsd &&
        !!value.token &&
        !!value.amount &&
        !!value.token.usdPrice && (
          <Typography.Text
            type="secondary"
            style={{ marginLeft: 8 }}
            className="ant-typography-caption"
          >
            (~{(value.amount / value.token.usdPrice).toFixed(3)}{" "}
            {value.token.symbol})
          </Typography.Text>
        )}
    </Checkbox>
  );

  if (!disabled) return checkbox;
  return (
    <Tooltip
      placement="bottom"
      overlayStyle={{ whiteSpace: "pre-wrap" }}
      title={
        "Dework could not find this token's USD price, so this feature is disabled. If there is a USD price for this token, write to us on Discord and we will help set this up.\n\nIf checked, the reward will be set in USD and converted to the equivalent amount of the selected token at the time of payment."
      }
    >
      {checkbox}
    </Tooltip>
  );
};

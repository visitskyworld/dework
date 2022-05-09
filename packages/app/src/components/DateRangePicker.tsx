import { DatePicker, Space, Typography, Button } from "antd";
import moment from "moment";
import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "./DateRangePicker.module.less";

interface Props {
  onSetRange: (range: string[]) => void;
}

export const DateRangePicker: FC<Props> = ({ onSetRange }) => {
  const [days, setDays] = useState(60);
  const onClickCustomRange = useCallback(
    (day: number) => {
      const startDate = moment().subtract(day, "days").toISOString();
      const endDate = moment().toISOString();
      setDays(day);
      onSetRange([startDate, endDate]);
    },
    [onSetRange]
  );
  const onClickAllTime = useCallback(() => {
    setDays(60);
    onSetRange(["", ""]);
  }, [onSetRange]);

  const [label, setLabel] = useState("Last 30 days");
  useEffect(() => {
    if (days !== 0) setLabel(days === 60 ? "All time" : `Last ${days} days`);
  }, [days]);

  return (
    <Space
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginLeft: 10,
      }}
    >
      <Typography.Text className="text-secondary">{label}</Typography.Text>
      <Space>
        <Button
          size="small"
          type={days === 7 ? "primary" : "default"}
          onClick={() => onClickCustomRange(7)}
        >
          7d
        </Button>
        <Button
          size="small"
          type={days === 30 ? "primary" : "default"}
          onClick={() => onClickCustomRange(30)}
        >
          30d
        </Button>
        <Button
          size="small"
          type={days === 60 ? "primary" : "default"}
          onClick={() => onClickAllTime()}
        >
          All time
        </Button>
        <DatePicker.RangePicker
          className={styles.iconOnly}
          onChange={(values) => {
            if (!values) return;
            onSetRange([
              moment(values[0]).toISOString(),
              moment(values[1]).toISOString(),
            ]);
            setDays(0);
            setLabel(
              `${moment(values[0]).format("YYYY-MM-DD")} - 
              ${moment(values[1]).format("YYYY-MM-DD")}`
            );
          }}
        />
      </Space>
    </Space>
  );
};

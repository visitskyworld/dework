import React, { FC, useCallback, useEffect, useState } from "react";
import moment from "moment-timezone";
import DeworkLogo from "@dewo/app/public/logo.svg";
import { TaskData, TaskUser } from "../utils/types";

interface Props {
  width: number;
  height: number;
  data: TaskData;
}

const NFTUserComponent: FC<{ user: TaskUser; label: string }> = ({
  user,
  label,
}) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
    <div className="nft-user" style={{ textAlign: "left" }}>
      <img src={user.imageUrl} alt={user.username} className="nft-user-image" />
      <div style={{ position: "relative", flex: 1, height: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p className="nft-user-username">{user.username}</p>
          <p className="typography-label">{user.address}</p>
        </div>
      </div>
    </div>
    <p className="typography-label" style={{ marginTop: 4 }}>
      {label}
    </p>
  </div>
);

export const NFT: FC<Props> = ({ width, height, data }) => {
  const [fontSize, setFontSize] = useState(0);

  const fitFont = useCallback(() => {
    const container = document.querySelector(".nft-name-container");
    if (!container) return;
    const h1 = container.querySelector("h1");
    if (!h1) return;

    h1.style.fontSize = "0px";
    const maxHeight = container.clientHeight;

    let size = 0;
    while (container.clientHeight <= maxHeight) {
      size++;
      h1.style.fontSize = `${size}px`;
    }

    h1.style.fontSize = `${size - 1}px`;
    setFontSize(size - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const container = document.querySelector(".nft-name-container");
    if (!container) return;

    const maxHeight = container.clientHeight;
    fitFont();

    new ResizeObserver(() => {
      if (container.clientHeight > maxHeight) {
        fitFont();
      }
    }).observe(container);
  }, [fitFont]);

  return (
    <div className="nft" style={{ width, height }}>
      <div className="nft-content">
        <img
          src={data.organization.imageUrl}
          alt={data.organization.name}
          className="nft-org-image"
        />
        <p style={{ opacity: 0.5, fontWeight: 600, marginTop: 4 }}>
          {data.organization.name}
        </p>
        <div
          className="nft-name-container"
          style={{
            flex: 1,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              marginBottom: 8,
              wordBreak: "break-word",
              lineHeight: "130%",
              fontSize,
            }}
          >
            {data.task.name}
          </h1>
          <p className="date">
            {moment(data.task.doneAt).tz("utc").format("ll")}
          </p>
          {/* <p className="date">{data.task.permalink}</p> */}
          {/* <p className="date">15 MATIC</p> */}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            ...(!!data.reviewer ? { alignSelf: "stretch" } : { width: "67%" }),
          }}
        >
          <NFTUserComponent user={data.user} label="Assignee" />
          {!!data.reviewer && (
            <NFTUserComponent user={data.reviewer} label="Reviewer" />
          )}
        </div>
        <div className="logo" style={{ marginTop: 16 }}>
          <img src={DeworkLogo.src} alt="Dework" />
          <span>Dework</span>
        </div>
      </div>
    </div>
  );
};

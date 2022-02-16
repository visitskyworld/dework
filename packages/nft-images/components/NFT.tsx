import React, { FC, useEffect, useState } from "react";
import moment from "moment-timezone";
import DeworkLogo from "@dewo/app/public/logo.svg";

interface NFTUser {
  imageUrl: string;
  username: string;
  address: string;
}

interface NFTData {
  organization: {
    imageUrl: string;
    name: string;
  };
  task: {
    name: string;
    permalink: string;
    doneAt: string;
  };
  user: NFTUser;
  reviewer?: NFTUser;
}

interface Props {
  width: number;
  height: number;
  data: NFTData;
}

const NFTUserComponent: FC<{ user: NFTUser; label: string }> = ({
  user,
  label,
}) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
    <p className="typography-label" style={{ marginBottom: 4 }}>
      {label}
    </p>
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
  </div>
);

export const NFT: FC<Props> = ({ width, height, data }) => {
  const [fontSize, setFontSize] = useState(0);
  useEffect(() => {
    // if (Math.random()) return;

    const container = document.querySelector(".nft-name-container");
    if (!container) return;
    const h1 = container.querySelector("h1");
    if (!h1) return;
    const initialMaxHeight = container.clientHeight;

    (async () => {
      let size = 0;
      while (container.clientHeight <= initialMaxHeight) {
        h1.style.fontSize = `${size}px`;
        size++;
      }

      setFontSize(size - 2);
    })();
  }, [data]);

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
            padding: "16px 8px",
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
          {/* <canvas
            width={100}
            height={50}
            style={{ width: 100, height: 50, background: "pink" }}
            ref={(ref) => {
              if (!ref) return;
              const context = ref.getContext("2d");
              if (!context) return;
              // context.font = "bold 12pt arial";
              context.font = getComputedStyle(
                document.querySelector("h1")!
              ).font;
              context.fillText("1234567890", 0, 30);

              const { width } = context.measureText("1234567890");
              console.warn(width);
            }}
          /> */}
          <p className="date">
            {moment(data.task.doneAt).tz("utc").format("ll")}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignSelf: "stretch" }}>
          <NFTUserComponent user={data.user} label="User" />
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

import { Modal } from "antd";
import React, { FC, useCallback, useRef } from "react";
import * as Icons from "@ant-design/icons";
import { useToggle } from "@dewo/app/util/hooks";
import YouTube from "react-youtube";

export const WatchDemoButton: FC = () => {
  const watchVideoDemo = useToggle();
  const youtubeRef = useRef<YouTube>(null);
  const closeVideoDemoModal = useCallback(() => {
    watchVideoDemo.toggleOff();
    youtubeRef.current?.getInternalPlayer().pauseVideo();
  }, [watchVideoDemo]);

  return (
    <>
      <div
        style={{
          width: "100%",
          aspectRatio: "5/3",
          display: "grid",
          placeItems: "center",
          position: "relative",
        }}
        className="hover:cursor-pointer highlight"
        onClick={watchVideoDemo.toggleOn}
      >
        <img
          style={{
            position: "absolute",
            objectFit: "cover",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            opacity: 0.5,
          }}
          src="/crypto-payments.jpeg"
        />
        <Icons.PlayCircleFilled style={{ fontSize: 100, color: "white" }} />
      </div>
      <Modal
        visible={watchVideoDemo.isOn}
        footer={null}
        bodyStyle={{ padding: 0 }}
        width="min(1280px, 100vw)"
        onCancel={closeVideoDemoModal}
      >
        <YouTube
          ref={youtubeRef}
          videoId="FT74b0dDYAU"
          opts={{ width: "100%", height: "720", playerVars: { autoplay: 1 } }}
        />
      </Modal>
    </>
  );
};

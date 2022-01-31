import { Typography, Modal } from "antd";
import React, { FC, useCallback, useRef } from "react";
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
      <Typography.Text
        strong
        underline
        className="hover:cursor-pointer"
        onClick={watchVideoDemo.toggleOn}
      >
        Watch Video
      </Typography.Text>
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
          opts={{
            width: "100%",
            height: "720",
            playerVars: { autoplay: 1 },
          }}
        />
      </Modal>
    </>
  );
};

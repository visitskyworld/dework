import React, { FC, ReactNode } from "react";
import { Image, Col, Row } from "antd";

interface Props {
  imageUrl?: string;
  avatar?: ReactNode;
}

export const CoverImageLayout: FC<Props> = ({ children, imageUrl, avatar }) => {
  return (
    <>
      {!!imageUrl ? (
        <Image
          width="100%"
          height={160}
          style={{ objectFit: "cover" }}
          src={imageUrl}
          preview={false}
        />
      ) : (
        <div style={{ height: 80 }} />
      )}
      <Col
        className="max-w-sm mx-auto"
        style={!!avatar && imageUrl ? { marginTop: -64 } : undefined}
      >
        <Row style={{ justifyContent: "center" }}>{avatar}</Row>
        <Col style={{ marginTop: 24 }}>{children}</Col>
      </Col>
    </>
  );
};

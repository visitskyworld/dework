import React, { FC } from "react";
import { Button, Col, Divider, Row } from "antd";
import { useOrganizationBySlug } from "../organization/hooks";
import { useRouter } from "next/router";
import * as Icons from "@ant-design/icons";
import { useSidebarContext } from "@dewo/app/contexts/sidebarContext";
import classNames from "classnames";
import styles from "./Sidebar.module.less";
import { OrganizationSidenav } from "./OrganizationSidenav";
import { SidebarUserSection } from "./SidebarUserSection";
import { UserInfo } from "./UserInfo";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

export const NavigationList: FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const orgSlug = router.query.organizationSlug as string;
  const organizationId = useOrganizationBySlug(orgSlug).organization?.id;
  const { isOn, toggleOff } = useSidebarContext();

  return (
    <Col flex={1} className={classNames("bg-body-secondary", styles.orgnav)}>
      <Row
        align="middle"
        className={classNames(!isOn && styles.minimized, "w-full")}
        style={{ paddingTop: 16, position: "absolute" }}
      >
        <Button
          onClick={toggleOff}
          type="text"
          className="mx-auto text-secondary"
          icon={<Icons.DoubleLeftOutlined rotate={isOn ? 180 : 0} />}
        />
      </Row>
      <div
        className={classNames(isOn ? styles.minimized : "", "flex", "h-full")}
        style={{ minWidth: 225, flexDirection: "column" }}
      >
        <Col flex={1} style={{ overflowY: "auto" }}>
          {orgSlug ? (
            <OrganizationSidenav organizationId={organizationId} />
          ) : (
            <SidebarUserSection />
          )}
        </Col>

        {!!user && (
          <>
            <Divider style={{ margin: 0 }} />
            <UserInfo />
          </>
        )}
      </div>
    </Col>
  );
};

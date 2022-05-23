import React, { FC } from "react";
import { Button, Col, Divider, Row } from "antd";
import { useOrganizationBySlug } from "../organization/hooks";
import { useRouter } from "next/router";
import * as Icons from "@ant-design/icons";
import { useSidebarContext } from "@dewo/app/contexts/SidebarContext";
import classNames from "classnames";
import styles from "./Sidebar.module.less";
import { OrganizationMenu } from "./menus/OrganizationMenu";
import { UserMenu } from "./menus/UserMenu";
import { MenuFooter } from "./MenuFooter";
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
            <OrganizationMenu organizationId={organizationId} />
          ) : (
            <UserMenu />
          )}
        </Col>

        {!!user && (
          <>
            <Divider style={{ margin: 0 }} />
            <MenuFooter />
          </>
        )}
      </div>
    </Col>
  );
};

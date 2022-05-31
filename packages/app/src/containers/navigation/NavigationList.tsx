import React, { FC, useMemo } from "react";
import { Button, Col, Divider, Row } from "antd";
import {
  useOrganizationBySlug,
  useOrganizationDetails,
} from "../organization/hooks";
import { useRouter } from "next/router";
import * as Icons from "@ant-design/icons";
import { useSidebarContext } from "@dewo/app/contexts/SidebarContext";
import classNames from "classnames";
import styles from "./Sidebar.module.less";
import { OrganizationMenu } from "./menus/OrganizationMenu";
import { UserMenu } from "./menus/UserMenu";
import { MenuFooter } from "./MenuFooter";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { MenuSkeleton } from "./menus/MenuSkeleton";
import { WorkspaceMenu } from "./menus/WorkspaceMenu";
import { useWorkspaceDetails } from "../workspace/hooks";

export const NavigationList: FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const organizationSlug = router.query.organizationSlug as string | undefined;
  const projectSlug = router.query.projectSlug as string | undefined;
  const organizationId =
    useOrganizationBySlug(organizationSlug).organization?.id;
  const { organization } = useOrganizationDetails(organizationId);

  const workspaceSlug = useMemo(() => {
    if (!!router.query.workspaceSlug) {
      return router.query.workspaceSlug as string;
    }
    const project = organization?.projects.find((p) => p.slug === projectSlug);
    if (!project?.workspaceId) return undefined;
    return organization?.workspaces.find((w) => w.id === project.workspaceId)
      ?.slug;
  }, [
    router.query.workspaceSlug,
    organization?.projects,
    organization?.workspaces,
    projectSlug,
  ]);
  const workspace = useWorkspaceDetails(workspaceSlug);
  const { isOn, toggleOff } = useSidebarContext();

  const content = useMemo(() => {
    if (!!organizationSlug) {
      if (!!workspaceSlug) {
        if (!workspace) return <MenuSkeleton />;
        return <WorkspaceMenu workspace={workspace} />;
      }

      if (!organizationId) return <MenuSkeleton />;
      return <OrganizationMenu organizationId={organizationId} />;
    } else {
      return <UserMenu />;
    }
  }, [organizationId, workspace, workspaceSlug, organizationSlug]);

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
        style={{ width: 220, flexDirection: "column" }}
      >
        <Col flex={1} style={{ overflowY: "auto" }}>
          {content}
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

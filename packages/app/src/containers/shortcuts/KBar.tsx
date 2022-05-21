import React, { FC, ReactElement, useEffect, useMemo, useState } from "react";
import {
  Action,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches,
  VisualState,
} from "kbar";
import { useRouter } from "next/router";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { Row, Typography } from "antd";
import {
  useOrganizationBySlug,
  useOrganizationDetails,
} from "../organization/hooks";
import {
  AppstoreOutlined,
  BellOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import styles from "./KBar.module.less";
import classNames from "classnames";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useIsDev } from "../user/hooks";

const Results: FC = () => {
  const { results } = useMatches();
  return (
    <KBarResults
      key={results.map((r) => (typeof r === "string" ? r : r.id)).join(",")}
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <Typography.Text
            className={classNames(styles.sectionHeader, "ant-form-item-label")}
          >
            {item}
          </Typography.Text>
        ) : (
          <Row
            align="middle"
            className={classNames(styles.result, active && styles.active)}
          >
            <div className={styles.icon}>{item.icon}</div>
            <Typography.Text className="font-semibold">
              {item.name}
            </Typography.Text>
          </Row>
        )
      }
    />
  );
};

const Content: FC = () => {
  const { visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }));

  const [delayedVisualState, setDelayedVisualState] = useState(visualState);
  useEffect(() => {
    requestAnimationFrame(() => setDelayedVisualState(visualState));
  }, [visualState]);
  const showBackdrop = [VisualState.animatingIn, VisualState.showing].includes(
    delayedVisualState
  );

  return (
    <KBarPortal>
      <KBarPositioner
        className={classNames(
          styles.container,
          showBackdrop && styles.backdrop
        )}
      >
        <KBarAnimator className={styles.box}>
          <KBarSearch
            defaultPlaceholder="Search for organizations, projects, and more..."
            className={classNames(
              styles.input,
              "ant-input",
              "ant-input-borderless",
              "ant-input-lg"
            )}
          />
          <Results />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
};

export const KBar: FC<{ children: ReactElement }> = ({ children }) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const isDev = useIsDev();

  const organizationSlug = router.query.organizationSlug as string | undefined;
  const { organization } = useOrganizationBySlug(organizationSlug);
  const projects = useOrganizationDetails(organization?.id).organization
    ?.projects;

  const actions = useMemo(() => {
    const actions: Action[] = [];

    if (!!projects) {
      actions.push(
        ...projects.map((p) => ({
          id: p.id,
          name: p.name,
          section: "Projects",
          icon: <ProjectOutlined />,
          perform: () => router.push(p.permalink),
        }))
      );
    }

    if (!!user) {
      actions.push(
        {
          id: "task-feed",
          name: "Task Feed",
          section: "For me",
          icon: <AppstoreOutlined />,
          perform: () => router.push("/task-feed"),
        },
        ...(isDev
          ? [
              {
                id: "notifications",
                name: "Inbox",
                section: "For me",
                icon: <BellOutlined />,
                perform: () => router.push("/notifications"),
              },
            ]
          : []),
        {
          id: "board",
          name: "My Task Board",
          section: "For me",
          icon: <ProjectOutlined />,
          perform: () => router.push(`${user.permalink}/board`),
        },
        {
          id: "profile",
          name: "Profile",
          section: "For me",
          icon: <UserAvatar user={user} size="small" />,
          perform: () => router.push(user.permalink),
        }
      );

      actions.push(
        ...user.organizations.map((o) => ({
          id: o.id,
          name: o.name,
          section: "Organizations",
          icon: <OrganizationAvatar organization={o} size="small" />,
          perform: () => router.push(o.permalink),
        }))
      );
    }

    return actions;
  }, [user, isDev, router, projects]);

  if (!user) return children;
  return (
    <KBarProvider
      actions={actions}
      options={{ animations: { enterMs: 300, exitMs: 300 } }}
    >
      <Content />
      {children}
    </KBarProvider>
  );
};

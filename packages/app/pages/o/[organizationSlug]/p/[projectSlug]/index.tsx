import React, { useCallback } from "react";
import { NextPage } from "next";
import { Layout, Modal } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { ProjectHeader } from "@dewo/app/containers/project/overview/ProjectHeader";
import { useProject } from "@dewo/app/containers/project/hooks";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";

const Page: NextPage = () => {
  const router = useRouter();
  const projId = useParseIdFromSlug("projectSlug");

  const navigateToProject = useCallback(
    () =>
      router.push(
        `/o/${router.query.organizationSlug}/p/${router.query.projectSlug}`
      ),
    [router]
  );
  const project = useProject(projId);

  if (!projId) {
    router.replace("/");
    return null;
  }

  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <ProjectHeader projectId={projId} />
        <Layout.Content style={{ flex: 1 }}>
          <ProjectTaskBoard projectId={projId} />
        </Layout.Content>
      </Layout.Content>

      <Modal
        visible={router.route.endsWith("/settings")}
        title="Project Settings"
        footer={null}
        onCancel={navigateToProject}
      >
        {!!project && <ProjectSettings project={project} />}
      </Modal>
    </Layout>
  );
};

export default Page;

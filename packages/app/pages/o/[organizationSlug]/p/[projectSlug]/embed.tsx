import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { useProject } from "@dewo/app/containers/project/hooks";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { ForbiddenResourceModal } from "@dewo/app/components/ForbiddenResourceModal";
import { TaskFilterProvider } from "@dewo/app/containers/task/board/filters/FilterContext";

const Page: NextPage = () => {
  const router = useRouter();

  const projectId = useParseIdFromSlug("projectSlug");
  const organizationId = useParseIdFromSlug("organizationSlug");
  const { error } = useProject(projectId);

  const forbiddenError = error?.message === "Forbidden resource";
  if (!projectId) {
    router.replace("/");
    return null;
  }

  if (Math.random()) {
    return <ProjectTaskBoard projectId={projectId} />;
  }

  return (
    <Layout.Content style={{ flex: 1 }}>
      <TaskFilterProvider>
        <ProjectTaskBoard projectId={projectId} />
      </TaskFilterProvider>
      <ForbiddenResourceModal
        visible={forbiddenError}
        projectId={projectId}
        organizationId={organizationId}
      />
    </Layout.Content>
  );
};

export default Page;

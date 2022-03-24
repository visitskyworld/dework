import React from "react";
import { NextPage } from "next";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { useProjectBySlug } from "@dewo/app/containers/project/hooks";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const router = useRouter();
  const projectSlug = router.query.projectSlug as string | undefined;
  const { project } = useProjectBySlug(projectSlug);
  const projectId = project?.id;
  return <ProjectTaskBoard projectId={projectId} />;
};

export default Page;

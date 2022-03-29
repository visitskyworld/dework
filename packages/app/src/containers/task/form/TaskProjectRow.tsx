import { FormSection } from "@dewo/app/components/FormSection";
import { ProjectAvatar } from "@dewo/app/components/ProjectAvatar";
import { Project } from "@dewo/app/graphql/types";
import { Button, Typography } from "antd";
import Link from "next/link";
import React, { FC } from "react";

interface Props {
  project: Project;
}

export const TaskProjectRow: FC<Props> = ({ project }) => (
  <FormSection label="Project">
    <Link href={project.permalink}>
      <a style={{ display: "flex" }}>
        <Button
          type="text"
          size="small"
          className="dewo-btn-highlight"
          icon={
            <ProjectAvatar
              size="small"
              style={{ flexShrink: 0 }}
              project={project}
            />
          }
        >
          <Typography.Text
            style={{
              marginLeft: 8,
              width: "100%",
              textAlign: "left",
            }}
            ellipsis
          >
            {project.name}
          </Typography.Text>
        </Button>
      </a>
    </Link>
  </FormSection>
);

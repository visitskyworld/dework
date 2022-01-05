import { Actions, Permissions } from "nest-casl";
import { SubjectType } from "@casl/ability";
import { Roles } from "../app/app.roles";
import { Organization } from "@dewo/api/models/Organization";
import { Project } from "@dewo/api/models/Project";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import {
  OrganizationMember,
  OrganizationRole,
} from "@dewo/api/models/OrganizationMember";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { ProjectMember, ProjectRole } from "@dewo/api/models/ProjectMember";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskTag } from "@dewo/api/models/TaskTag";

export enum CustomPermissionActions {
  claimTask = "claimTask",
}

export const permissions: Permissions<
  Roles,
  SubjectType,
  CustomPermissionActions & Actions
> = {
  everyone({ can, user }) {
    can(Actions.read, Organization);
    can(Actions.read, Project);
    can(Actions.read, Task);

    can(Actions.create, Organization);
    can(Actions.manage, OrganizationMember, {
      userId: user.id,
      role: OrganizationRole.FOLLOWER,
    });
    can(
      Actions.update,
      Task,
      ["status", "status[TODO]", "status[IN_PROGRESS]", "status[IN_REVIEW]"],
      {
        assignees: { $elemMatch: { id: user.id } },
        status: { $ne: TaskStatus.DONE },
      }
    );
    can(Actions.update, Task, "submission", {
      assignees: { $elemMatch: { id: user.id } },
      status: { $ne: TaskStatus.DONE },
    });
    can(Actions.update, Task, { ownerId: user.id });
    can(CustomPermissionActions.claimTask, Task, {
      status: TaskStatus.TODO,
    });
  },

  organizationOwner({ extend, can, user }) {
    extend(Roles.organizationAdmin);
    can(Actions.delete, Organization);
    can(Actions.manage, OrganizationMember, { userId: { $ne: user.id } });
  },

  organizationAdmin({ can, cannot, user, extend }) {
    extend(Roles.projectAdmin);

    can(Actions.manage, OrganizationMember, {
      userId: { $ne: user.id },
      role: { $in: [OrganizationRole.ADMIN, OrganizationRole.FOLLOWER] },
    });
    can(Actions.delete, OrganizationMember, {
      role: { $ne: OrganizationRole.OWNER },
    });

    can(Actions.update, Organization);

    can(Actions.create, Project);
    can(Actions.delete, Project);
    can(Actions.manage, ProjectMember);

    cannot(CustomPermissionActions.claimTask, Task);
    cannot(Actions.update, Task, "submission");
  },

  projectAdmin({ can, extend }) {
    extend(Roles.projectContributor);

    can(Actions.update, Project);
    can(Actions.manage, ProjectMember);

    can(Actions.create, ProjectIntegration);
    can(Actions.update, ProjectIntegration);
    can(Actions.delete, ProjectIntegration);

    can(Actions.create, Task);
    can(Actions.update, Task);
    can(Actions.delete, Task);

    can(Actions.create, TaskTag);
  },

  projectContributor({ can, cannot, user }) {
    can(Actions.create, ProjectMember, { role: ProjectRole.CONTRIBUTOR });
    can(Actions.create, Task, { status: TaskStatus.BACKLOG });
    cannot(Actions.create, Task, [
      "ownerId",
      "reward",
      "status[TODO]",
      "status[IN_PROGRESS]",
      "status[IN_REVIEW]",
      "status[DONE]",
    ]);

    can(Actions.manage, TaskReaction, { userId: user.id });
  },
};

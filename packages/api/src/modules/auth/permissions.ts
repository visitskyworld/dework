import { Actions, Permissions } from "nest-casl";
import { SubjectType } from "@casl/ability";
import { Roles } from "../app/app.roles";

export enum CustomPermissionActions {
  claimTask = "claimTask",
}

export const permissions: Permissions<
  Roles,
  SubjectType,
  CustomPermissionActions & Actions
> = {
  /*
  everyone({ can, user }) {
    can(Actions.read, Organization);
    can(Actions.read, Project, { visibility: ProjectVisibility.PUBLIC });
    can(Actions.read, Task);

    can(Actions.delete, TaskApplication, { userId: user.id });
    can(Actions.update, TaskSubmission, { userId: user.id });
    can(CustomPermissionActions.claimTask, Task, {
      status: TaskStatus.TODO,
      assignees: { $exists: true, $size: 0 },
    });
  },

  authenticated({ can, user }) {
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
    can(
      Actions.update,
      Task,
      [
        "name",
        "description",
        "status",
        "tagIds",
        "assigneeIds",
        "ownerId",
        "dueDate",
        "storyPoints",
      ],
      { ownerId: user.id }
    );

    can(Actions.update, Task, "submissions", {
      assignees: { $elemMatch: { id: user.id } },
    });
    can(Actions.update, Task, "submissions", {
      // @ts-ignore
      "options.allowOpenSubmission": true,
    });

    can(Actions.update, Task, "subtasks", {
      assignees: { $elemMatch: { id: user.id } },
    });
    can(Actions.update, Task, "subtasks", { creatorId: user.id });
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
    can(Actions.manage, ProjectSection);

    cannot(CustomPermissionActions.claimTask, Task);
  },

  projectAdmin({ can, extend }) {
    extend(Roles.projectContributor);

    can(Actions.update, Project);
    can(Actions.manage, ProjectMember);
    can(Actions.manage, ProjectIntegration);

    can(Actions.create, Task);
    can(Actions.update, Task, [
      "name",
      "description",
      "status",
      "status[BACKLOG]",
      "status[TODO]",
      "status[IN_PROGRESS]",
      "status[IN_REVIEW]",
      "status[DONE]",
      "tagIds",
      "assigneeIds",
      "sectionId",
      "ownerId",
      "dueDate",
      "storyPoints",
      "reward",
      "options",
      "subtasks",
    ]);
    can(Actions.delete, Task);

    can(Actions.read, TaskApplication);
    can(Actions.delete, TaskApplication);
    can(Actions.manage, TaskSubmission);

    can(Actions.manage, TaskTag);
    can(Actions.manage, TaskSection);
    can(Actions.manage, ProjectTokenGate);

    extend(Roles.authenticated);
  },

  projectContributor({ can, cannot, user }) {
    can(Actions.read, Project, { visibility: ProjectVisibility.PRIVATE });
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

  superadmin({ extend }) {
    extend(Roles.organizationOwner);
  },
  */
};

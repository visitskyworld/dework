import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { PaymentStatus } from "@dewo/api/models/Payment";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { InviteAcceptedEvent } from "../../invite/invite.events";
import {
  PaymentConfirmedEvent,
  PaymentCreatedEvent,
} from "../../payment/payment.events";
import {
  TaskApplicationCreatedEvent,
  TaskApplicationDeletedEvent,
  TaskCreatedEvent,
  TaskSubmissionCreatedEvent,
  TaskUpdatedEvent,
} from "../../task/task.events";
import { NotificationService } from "../notification.service";

describe("NotificationService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let service: NotificationService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    service = app.get(NotificationService);
  });

  afterAll(() => app.close());

  async function updateTask(
    prev: Partial<Omit<Task, "rewards">>,
    next: Partial<Omit<Task, "rewards">>,
    user?: User
  ) {
    const prevTask = await fixtures.createTask(prev);
    const task = await fixtures.updateTask({ id: prevTask.id, ...next });
    await service.processTaskUpdatedEvent(
      new TaskUpdatedEvent(task!, prevTask, user?.id)
    );
    return { task: task!, user };
  }

  async function createTask(
    partialTask: Partial<Omit<Task, "rewards">>,
    user?: User
  ) {
    const task = await fixtures.createTask(partialTask);
    await service.processTaskCreatedEvent(new TaskCreatedEvent(task, user?.id));
    return { task, user };
  }

  async function createTaskApplication(
    partialTask: Partial<Omit<Task, "rewards">>
  ) {
    const task = await fixtures.createTask(partialTask);
    const application = await fixtures.createTaskApplication();
    await service.processTaskApplicationCreatedEvent(
      new TaskApplicationCreatedEvent(task, application)
    );
    return { task, application };
  }

  async function rejectTaskApplication(
    partialTask: Partial<Omit<Task, "rewards">>
  ) {
    const task = await fixtures.createTask(partialTask);
    const application = await fixtures.createTaskApplication();
    await service.processTaskApplicationDeletedEvent(
      new TaskApplicationDeletedEvent(task, application)
    );
    return { task, application };
  }

  async function createTaskSubmission(
    partialTask: Partial<Omit<Task, "rewards">>
  ) {
    const task = await fixtures.createTask(partialTask);
    const submission = await fixtures.createTaskSubmission();
    await service.processTaskSubmissionCreatedEvent(
      new TaskSubmissionCreatedEvent(task, submission)
    );
    return { task, submission };
  }

  async function createInvite(inviter: User, invited: User) {
    const invite = await fixtures.createInvite(
      { permission: RulePermission.MANAGE_ORGANIZATION },
      inviter
    );
    await service.processInviteAcceptedEvent(
      new InviteAcceptedEvent(invited, invite)
    );
    return { invited, invite };
  }

  async function createPayment(
    user: User,
    network: PaymentNetwork,
    partialTask?: Partial<Omit<Task, "rewards">>
  ) {
    const task = await fixtures.createTask(partialTask);
    const payment = await fixtures.createPayment({ networkId: network.id });
    await service.processPaymentCreatedEvent(
      new PaymentCreatedEvent(payment, task, user.id)
    );
    return { task, payment };
  }

  async function createConfirmedPayment(
    network: PaymentNetwork,
    partialTask?: Partial<Omit<Task, "rewards">>
  ) {
    const task = await fixtures.createTask(partialTask);
    const payment = await fixtures.createPayment({ networkId: network.id });
    payment.status = PaymentStatus.CONFIRMED;
    await service.processPaymentConfirmedEvent(
      new PaymentConfirmedEvent(payment, task)
    );
    return { task };
  }

  describe("TaskUpdatedEvent", () => {
    describe("status change", () => {
      let assignees: [User, User];
      let owners: [User, User];

      beforeEach(async () => {
        assignees = [await fixtures.createUser(), await fixtures.createUser()];
        owners = [await fixtures.createUser(), await fixtures.createUser()];
      });

      it("should send in progress update to owners", async () => {
        const { task } = await updateTask(
          { assignees, owners },
          { status: TaskStatus.IN_PROGRESS },
          owners[0]
        );
        await expect(assignees[0].notifications).resolves.toHaveLength(0);
        await expect(assignees[1].notifications).resolves.toHaveLength(0);
        await expect(owners[0].notifications).resolves.toHaveLength(0);
        await expect(owners[1].notifications).resolves.toHaveLength(1);
        await expect(owners[1].notifications).resolves.toContainEqual(
          expect.objectContaining({
            taskId: task.id,
            message: `Task in progress: ${task.name}`,
          })
        );
      });

      it("should send in review update to owners", async () => {
        const { task } = await updateTask(
          { assignees, owners },
          { status: TaskStatus.IN_REVIEW },
          owners[0]
        );
        await expect(assignees[0].notifications).resolves.toHaveLength(0);
        await expect(assignees[1].notifications).resolves.toHaveLength(0);
        await expect(owners[0].notifications).resolves.toHaveLength(0);
        await expect(owners[1].notifications).resolves.toHaveLength(1);
        await expect(owners[1].notifications).resolves.toContainEqual(
          expect.objectContaining({
            taskId: task.id,
            message: `Task ready for review: ${task.name}`,
          })
        );
      });
    });

    describe("assignees change", () => {
      let assignees: [User, User];
      let owners: [User, User];

      beforeEach(async () => {
        assignees = [await fixtures.createUser(), await fixtures.createUser()];
        owners = [await fixtures.createUser(), await fixtures.createUser()];
      });

      it("should send a notification to every new assignee", async () => {
        const { task } = await updateTask(
          { assignees },
          {
            assignees: [
              await fixtures.createUser(),
              await fixtures.createUser(),
            ],
          },
          owners[0]
        );
        await expect(assignees[0].notifications).resolves.toHaveLength(0);
        await expect(assignees[1].notifications).resolves.toHaveLength(0);
        await expect(owners[0].notifications).resolves.toHaveLength(0);
        await expect(owners[1].notifications).resolves.toHaveLength(0);
        await expect(task.assignees[0].notifications).resolves.toHaveLength(1);
        await expect(task.assignees[1].notifications).resolves.toHaveLength(1);
        await expect(task.assignees[0].notifications).resolves.toContainEqual(
          expect.objectContaining({
            taskId: task.id,
            message: `You’ve been assigned: ${task.name}`,
          })
        );
      });

      it("should send a notification to every owner when someone is assigned", async () => {
        const { task } = await updateTask(
          { assignees, owners },
          {
            assignees: [
              await fixtures.createUser(),
              await fixtures.createUser(),
            ],
          },
          owners[0]
        );
        await expect(owners[0].notifications).resolves.toHaveLength(0);
        await expect(owners[1].notifications).resolves.toHaveLength(1);
        await expect(owners[1].notifications).resolves.toContainEqual(
          expect.objectContaining({
            taskId: task.id,
            message: `${task.assignees
              .map((u) => u.username)
              .join(",")} have been assigned: ${task.name}`,
          })
        );
      });
    });

    describe("owners change", () => {
      let assignees: [User, User];
      let owners: [User, User];

      beforeEach(async () => {
        assignees = [await fixtures.createUser(), await fixtures.createUser()];
        owners = [await fixtures.createUser(), await fixtures.createUser()];
      });

      it("should send a notification to every owner when added as a reviewer", async () => {
        const { task } = await updateTask({ assignees }, { owners }, owners[0]);
        await expect(owners[0].notifications).resolves.toHaveLength(0);
        await expect(owners[1].notifications).resolves.toHaveLength(1);
        await expect(assignees[0].notifications).resolves.toHaveLength(0);
        await expect(assignees[1].notifications).resolves.toHaveLength(0);
        await expect(owners[1].notifications).resolves.toContainEqual(
          expect.objectContaining({
            taskId: task.id,
            message: `You’ve been added as a reviewer: ${task.name}`,
          })
        );
      });
    });
  });

  describe("TaskCreatedEvent", () => {
    let assignees: [User, User];
    let owners: [User, User];

    beforeEach(async () => {
      assignees = [await fixtures.createUser(), await fixtures.createUser()];
      owners = [await fixtures.createUser(), await fixtures.createUser()];
    });

    it("should send a notification to every new assignee", async () => {
      const { task } = await createTask({ assignees }, owners[0]);
      await expect(task.assignees[0].notifications).resolves.toHaveLength(1);
      await expect(task.assignees[1].notifications).resolves.toHaveLength(1);
      await expect(owners[0].notifications).resolves.toHaveLength(0);
      await expect(task.assignees[0].notifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task.id,
          message: `You’ve been assigned: ${task.name}`,
        })
      );
    });

    it("should send a notification to all reviewers", async () => {
      const { task } = await createTask({ owners }, owners[0]);
      await expect(owners[0].notifications).resolves.toHaveLength(0);
      await expect(owners[1].notifications).resolves.toHaveLength(1);
      await expect(owners[1].notifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task.id,
          message: `You’ve been added as a reviewer: ${task.name}`,
        })
      );
    });

    it("should send a notification to all reviewers when someone is assigned", async () => {
      const { task } = await createTask({ assignees, owners }, owners[0]);
      await expect(owners[0].notifications).resolves.toHaveLength(0);
      await expect(owners[1].notifications).resolves.toHaveLength(1);
      await expect(owners[1].notifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task.id,
          message: `You’ve been added as a reviewer: ${task.name}`,
        })
      );
    });
  });

  describe("TaskApplicationCreatedEvent", () => {
    it("should send a notification to reviewers when someone applies to a task", async () => {
      const owner = await fixtures.createUser();
      const { task, application } = await createTaskApplication({
        owners: [owner],
      });

      await expect(
        (
          await application.user
        ).notifications
      ).resolves.toHaveLength(0);
      await expect(task.owners[0].notifications).resolves.toHaveLength(1);
      await expect(task.owners[0].notifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task.id,
          message: `${(await application.user).username} has applied to: ${
            task.name
          }`,
        })
      );
    });
  });

  describe("TaskApplicationDeletedEvent", () => {
    it("should send a notification to submitter when application is rejected", async () => {
      const owner = await fixtures.createUser();
      const { task, application } = await rejectTaskApplication({
        owners: [owner],
      });
      const submitterNotifications = (await application.user).notifications;

      await expect(submitterNotifications).resolves.toHaveLength(1);
      await expect(submitterNotifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task.id,
          message: `Task Application rejected: ${task.name}`,
        })
      );
      await expect(owner.notifications).resolves.toHaveLength(0);
    });
  });

  describe("TaskSubmissionCreatedEvent", () => {
    it("should send a notification to reviewers when someone creates a submission", async () => {
      const owner = await fixtures.createUser();
      const { task, submission } = await createTaskSubmission({
        owners: [owner],
      });

      const submitter = await submission.user;
      await expect(submitter.notifications).resolves.toHaveLength(0);
      await expect(owner.notifications).resolves.toHaveLength(1);
      await expect(owner.notifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task.id,
          message: `${submitter.username} has submitted work for: ${task.name}`,
        })
      );
    });
  });

  describe("InviteAcceptedEvent", () => {
    it("should send a notification to inviter when someone accepts an invite", async () => {
      const { invited, invite } = await createInvite(
        await fixtures.createUser(),
        await fixtures.createUser()
      );
      const inviter = await invite.inviter;
      const organization = await invite.organization;
      await expect(invited.notifications).resolves.toHaveLength(0);
      await expect(inviter.notifications).resolves.toHaveLength(1);
      await expect(inviter.notifications).resolves.toContainEqual(
        expect.objectContaining({
          message: `${invited.username} has joined ${organization?.name}`,
        })
      );
    });
  });

  describe("PaymentCreatedEvent", () => {
    let network: PaymentNetwork;
    let assignees: [User, User];

    beforeEach(async () => {
      network = await fixtures.createPaymentNetwork({
        slug: "ethereum-testnet",
      });
      assignees = [await fixtures.createUser(), await fixtures.createUser()];
    });

    it("should send a notification to assignees when payment is processing", async () => {
      const { task } = await createPayment(assignees[0], network, {
        assignees,
      });

      await expect(assignees[0].notifications).resolves.toHaveLength(0);
      await expect(assignees[1].notifications).resolves.toHaveLength(1);
      await expect(assignees[1].notifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task?.id,
          message: `Task reward is processing payment: ${task.name}`,
        })
      );
    });
  });

  describe("PaymentConfirmedEvent", () => {
    let network: PaymentNetwork;

    beforeEach(async () => {
      network = await fixtures.createPaymentNetwork({
        slug: "ethereum-testnet",
      });
    });

    it("should send a notification to assignees when payment is confirmed", async () => {
      const assignee = await fixtures.createUser();
      const { task } = await createConfirmedPayment(network, {
        assignees: [assignee],
      });

      await expect(assignee.notifications).resolves.toHaveLength(1);
      await expect(assignee.notifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task?.id,
          message: `Task reward has been paid: ${task.name}`,
        })
      );
    });
  });
});

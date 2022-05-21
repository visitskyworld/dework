import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { NotificationRequests } from "@dewo/api/testing/requests/notification.requests";
import { INestApplication } from "@nestjs/common";

describe("NotificationResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
  });

  afterAll(() => app.close());

  describe("Queries", () => {
    describe("User.notificationCount", () => {
      it("should return notification count", async () => {
        const user = await fixtures.createUser();
        await fixtures.createNotification({ userId: user.id });

        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: NotificationRequests.getCount(),
        });

        expect(res.body.data.me.notificationReadMarker).toBe(null);
        expect(res.body.data.me.notificationUnreadCount).toEqual(1);
      });
    });
  });

  describe("Mutations", () => {
    describe("markNotificationsRead", () => {
      it("should clear read notifications", async () => {
        const user = await fixtures.createUser();
        await fixtures.createNotification({ userId: user.id });

        const readAt = new Date();
        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: NotificationRequests.markRead(readAt),
        });

        expect(res.body.data.me.notificationReadMarker).not.toBe(null);
        expect(res.body.data.me.notificationReadMarker.readAt).toEqual(
          readAt.toISOString()
        );
        expect(res.body.data.me.notificationUnreadCount).toEqual(0);
      });
    });
  });
});

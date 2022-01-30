import React, { FC, useCallback, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Col, Divider, Layout, Tooltip } from "antd";
import { HeaderProfileAvatar } from "./header/HeaderProfileAvatar";
import { CreateOrganizationButton } from "./CreateOrganizationButton";
import { SidebarNavLink } from "./SidebarNavLink";
import { useSidebarContext } from "@dewo/app/contexts/sidebarContext";
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
import { useUpdateOrganizationMember } from "../organization/hooks";
import { getSortKeyBetween } from "../task/board/util";
import _ from "lodash";

export const Sidebar: FC = () => {
  const { user } = useAuthContext();
  const { isOn, toggle } = useSidebarContext();

  const organizations = useMemo(
    () => _.sortBy(user?.organizations, (o) => o.member?.sortKey).reverse(),
    [user?.organizations]
  );

  const updateMember = useUpdateOrganizationMember();
  const handleDragEnd = useCallback<DragDropContextProps["onDragEnd"]>(
    async (result) => {
      if (!user || !organizations) return;
      if (result.reason !== "DROP" || !result.destination) return;

      const organizationId = result.draggableId;
      const org = organizations.find((o) => o.id === organizationId);
      if (!org) return;

      const indexExcludingItself = (() => {
        const newIndex = result.destination.index;
        const oldIndex = result.source.index;
        // To get the items above and below the currently dropped card
        // we need to offset the new index by 1 if the card was dragged
        // from above in the same lane. The card we're dragging from
        // above makes all other items move up one step
        if (oldIndex < newIndex) return newIndex + 1;
        return newIndex;
      })();

      const orgAbove = organizations[indexExcludingItself - 1];
      const orgBelow = organizations[indexExcludingItself];
      const sortKey = getSortKeyBetween(
        orgBelow,
        orgAbove,
        (o) => o.member?.sortKey
      );

      await updateMember(
        { organizationId, userId: user.id, sortKey },
        org.member ?? undefined
      );
    },
    [organizations, updateMember, user]
  );

  if (!user) return null;
  if (typeof window === "undefined") return null;
  return (
    <Layout.Sider
      collapsible
      breakpoint="sm"
      onBreakpoint={toggle}
      width={72}
      collapsedWidth="0"
      collapsed={isOn}
      trigger={null}
      className="dewo-divider-right"
    >
      <Col
        style={{
          height: "100%",
          padding: "12px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SidebarNavLink
          href={`/profile/${user.id}`}
          className="dewo-sidebar-item"
          clickable={false}
        >
          <HeaderProfileAvatar />
        </SidebarNavLink>

        <Divider style={{ margin: "12px 0" }} />

        <Col style={{ flex: 1, overflowX: "hidden", overflowY: "auto" }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="organization-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {organizations.map((organization, index) => (
                    <Draggable
                      key={organization.id}
                      draggableId={organization.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <SidebarNavLink
                            key={organization.id}
                            href={organization.permalink}
                            className="dewo-sidebar-item"
                          >
                            <OrganizationAvatar
                              size={48}
                              organization={organization}
                              tooltip={{ placement: "right" }}
                            />
                          </SidebarNavLink>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Tooltip title="Create Organization" placement="right">
            <CreateOrganizationButton type="text" className="dewo-sidebar-item">
              <Avatar size={48} icon={<Icons.PlusOutlined />} />
            </CreateOrganizationButton>
          </Tooltip>
        </Col>
      </Col>
    </Layout.Sider>
  );
};

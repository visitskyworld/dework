import { Button, Input, Modal, Row, Typography } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import {
  useUpdateTaskSection,
  useCreateTaskSection,
  useDeleteTaskSection,
  useProjectDetails,
} from "../../project/hooks";
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
import { TaskSection, TaskStatus } from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";
import _ from "lodash";
import { getSortKeyBetween } from "./util";

interface Props {
  visible: boolean;
  projectId: string;
  status: TaskStatus;
  onClose(): void;
}

const TaskSectionRow: FC<{ section: TaskSection }> = ({ section }) => {
  const updateSection = useUpdateTaskSection();
  const [handleUpdateName, updatingName] = useRunningCallback(
    async (name: string) => {
      await updateSection(
        { id: section.id, projectId: section.projectId, name },
        section
      );
    },
    [updateSection, section]
  );

  const deleteSection = useDeleteTaskSection();
  const [handleDelete, deleting] = useRunningCallback(
    () =>
      deleteSection({
        id: section.id,
        projectId: section.projectId,
        deletedAt: new Date().toISOString(),
      }),
    [deleteSection, section]
  );

  return (
    <Row
      className="ant-btn ant-btn-text"
      align="middle"
      style={{ height: "unset" }}
    >
      <Icons.HolderOutlined />
      <Typography.Paragraph
        style={{ margin: "0 12px", flex: 1, textAlign: "left" }}
        editable={{ triggerType: ["text"], onChange: handleUpdateName }}
      >
        {section.name}
      </Typography.Paragraph>
      {updatingName && <Icons.LoadingOutlined />}
      <Button
        loading={deleting}
        icon={<Icons.DeleteOutlined />}
        size="small"
        type="text"
        className="text-secondary"
        onClick={handleDelete}
      />
    </Row>
  );
};

export const ReorderTaskSectionsModal: FC<Props> = ({
  visible,
  projectId,
  status,
  onClose,
}) => {
  const { project } = useProjectDetails(projectId);
  const sections = useMemo(
    () =>
      _.sortBy(
        project?.taskSections.filter((s) => s.status === status),
        (s) => s.sortKey
      ).reverse(),
    [project, status]
  );

  const updateSection = useUpdateTaskSection();
  const handleDragEnd = useCallback<DragDropContextProps["onDragEnd"]>(
    async (result) => {
      if (result.reason !== "DROP" || !result.destination) return;

      const sectionId = result.draggableId;
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return;

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

      const sectionAbove = sections[indexExcludingItself - 1];
      const sectionBelow = sections[indexExcludingItself];
      const sortKey = getSortKeyBetween(
        sectionBelow,
        sectionAbove,
        (s) => s.sortKey
      );

      await updateSection(
        { id: section.id, projectId: section.projectId, sortKey },
        section
      );
    },
    [sections, updateSection]
  );

  const [newSectionName, setNewSectionName] = useState("");
  const createSection = useCreateTaskSection();
  const [handleCreate, creating] = useRunningCallback(async () => {
    if (!newSectionName) return;
    await createSection({ name: newSectionName, status, projectId });
    setNewSectionName("");
  }, [createSection, newSectionName, status, projectId]);

  if (!project) return null;
  return (
    <Modal visible={visible} onCancel={onClose} width={368} footer={null}>
      <Typography.Title level={5} style={{ textAlign: "center" }}>
        Manage Sections
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ textAlign: "center" }}>
        Create, reorder and remove task sections
      </Typography.Paragraph>

      <Row align="middle" style={{ gap: 4, marginLeft: 12 }}>
        <Button
          icon={<Icons.PlusCircleOutlined />}
          shape="circle"
          size="small"
          type="text"
          className="text-secondary"
          loading={creating}
          onClick={handleCreate}
        />
        <Input.TextArea
          autoSize
          className="dewo-field dewo-field-focus-border"
          style={{ flex: 1 }}
          placeholder="Add section..."
          disabled={creating}
          value={newSectionName}
          onChange={(event) => setNewSectionName(event.target.value)}
          onPressEnter={handleCreate}
        />
      </Row>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskSectionRow section={section} />
                      <div style={{ height: 4 }} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Modal>
  );
};

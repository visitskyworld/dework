import { Row, Space } from "antd";
import React, { FC } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Task } from "../types/Task";
import { TaskBoardColumn } from "./TaskBoardColumn";

const columns = ["1", "2", "3"];
const columnWidth = 300;

const task: Task = {
  id: "1",
  title: "Move to Dubai",
  subtitle: "#123 created by fant.sol",
  tags: [
    { color: "red", label: "Lower Taxes" },
    { color: "yellow", label: "Better Weather" },
    // { color: "green", label: `${BOUNTY_SIZE.toNumber()} gwei` },
  ],
};

interface Props {}

export const TaskBoard: FC<Props> = () => {
  return (
    <DragDropContext onDragEnd={console.warn}>
      <Row style={{ width: columnWidth * columns.length }}>
        <Space size="middle" align="start">
          {columns.map((id, index) => (
            <div style={{ width: columnWidth }}>
              <TaskBoardColumn
                key={id}
                index={index}
                tasks={Array(Number(id))
                  .fill(null)
                  .map((_, taskIndex) => ({
                    ...task,
                    id: `${index}-${taskIndex}`,
                  }))}
              />
            </div>
          ))}
        </Space>
      </Row>
      {/* {state.map((el, ind) => (
        <Droppable key={ind} droppableId={`${ind}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {el.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        {item.content}
                        <button
                          type="button"
                          onClick={() => {
                            const newState = [...state];
                            newState[ind].splice(index, 1);
                            setState(newState.filter((group) => group.length));
                          }}
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))} */}
    </DragDropContext>
  );
};

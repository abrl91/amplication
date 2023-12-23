import { memo, type FC, useContext } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

import * as models from "../../../models";
import { CLASS_NAME } from "../ArchitectureConsole";
import { AppContext } from "../../../context/appContext";
import { Link } from "react-router-dom";
import { Icon } from "@amplication/ui/design-system";
import classNames from "classnames";
import { NodePayload } from "../types";

type ModelProps = Omit<NodeProps, "data"> & {
  data: NodePayload<models.Entity>;
};

const ModelNode: FC<ModelProps> = memo(({ data }) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  return (
    <div
      className={classNames(`${CLASS_NAME}__node_container`, {
        "pending-changes": data.originalParentNode,
      })}
      tabIndex={0}
      style={{ borderSpacing: 0 }}
      title={data.payload.description}
    >
      <div className={`${CLASS_NAME}__display_name`}>
        {data.payload.displayName}
        <Link
          className={`${CLASS_NAME}__display_icon`}
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/entities/${data.payload.id}`}
        >
          <Icon icon="edit_2" size="small" />
        </Link>
      </div>
      <div className={`${CLASS_NAME}__column_container`}>
        {data.payload.fields.map((field) => (
          <Column column={field} key={field.permanentId} />
        ))}
      </div>
    </div>
  );
});
ModelNode.displayName = "ModelNode";

export default ModelNode;

interface ColumnProps {
  column: models.EntityField;
}

const Column = memo(({ column }: ColumnProps) => {
  return (
    <div
      key={column.permanentId}
      className={`${CLASS_NAME}__column_inner_container`}
    >
      <Handle
        className={`${CLASS_NAME}__handle_left`}
        type="source"
        id={column.permanentId}
        position={Position.Left}
        isConnectable={false}
      />

      <div className={`${CLASS_NAME}__column_display_name`}>
        <span title={column.description}>{column.displayName}</span>
        <span
          className={`${CLASS_NAME}__column_display_name_datatype`}
          title={`${column.required ? "Required" : "Not required"} ${
            column.unique ? " and unique" : ""
          }`}
        >
          {`${column.dataType}${column.required ? "" : "?"}`}
        </span>
        {column.customAttributes && (
          <span
            className={`${CLASS_NAME}__column_display_name_custom_attributes`}
          >
            {column.customAttributes}
          </span>
        )}
      </div>

      <Handle
        className={`${CLASS_NAME}__handle_right`}
        type="source"
        id={column.permanentId}
        position={Position.Right}
        isConnectable={false}
      />
    </div>
  );
});

Column.displayName = "Column";

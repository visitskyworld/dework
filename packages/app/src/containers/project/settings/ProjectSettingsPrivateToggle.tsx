import { FC } from "react";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectSettingsPrivateToggle: FC<Props> = (
  {
    // projectId,
    // organizationId,
  }
) => {
  return null;
  /*
  const canCreateRoles = usePermission("create", "Rule");
  const canDeleteRoles = usePermission("delete", "Rule");
  const canManageRoles = canCreateRoles && canDeleteRoles;

  const roles = useOrganizationRoles(organizationId);
  const fallbackRole = useMemo(() => roles?.find((r) => r.fallback), [roles]);
  const privateRule = useMemo(
    () =>
      fallbackRole?.rules.some(
        (r) =>
          r.projectId === projectId &&
          r.inverted &&
          r.permission === RulePermission.VIEW_PROJECTS
      ),
    [fallbackRole, projectId]
  );

  const createRule = useCreateRule();
  const handleChange = useCallback(
    async (visibility: "public" | "private") => {
      if (visibility === "private") {
        await createRule({
          permission: RulePermission.VIEW_PROJECTS,
          inverted: true,
          projectId,
          roleId: fallbackRole!.id,
        });
        // create rule like privateRule
      } else {
        // delete rule: privateRule
      }
    },
    [createRule, projectId, fallbackRole]
  );

  // const viewChannelRule
  // make sure the user can manage roles
  return (
    <FormSection
      label="Visibility"
      tooltip="By default all projects are public. Make a project private if you only want to share it with users with certain roles."
      style={{ margin: 0 }}
    >
      <Radio.Group
        value={!!privateRule ? "private" : "public"}
        disabled={!canManageRoles || !fallbackRole}
        onChange={(e) => handleChange(e.target.value)}
      >
        <Radio.Button value="public">Public</Radio.Button>
        <Radio.Button value="private">Private</Radio.Button>
      </Radio.Group>
    </FormSection>
  );
  */
};

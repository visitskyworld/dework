import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Col, Row } from "antd";
import Link from "next/link";
import React, { FC } from "react";

export const SidebardOrganizationList: FC = () => {
  const { user } = useAuthContext();
  return (
    <Col>
      {user?.organizations.map((organization) => (
        <Link href={`/organization/${organization.id}`}>
          <a>
            <Row style={{ padding: 16 }}>
              <OrganizationAvatar
                key={organization.id}
                organization={organization}
              />
            </Row>
          </a>
        </Link>
      ))}
    </Col>
  );
};

import React from "react";
import { Users } from "./User";
import { Card } from "./Card";

interface IProps {
  ownId: string;
  users: Users;
}

export const Results = ({ ownId, users }: IProps) => {
  const numberOfFinishedUsers = Object.keys(users).filter(
    key => !!users[key] && !!users[key].value
  ).length;
  const totalNumberOfUsers = Object.keys(users).length;
  const disclose = numberOfFinishedUsers === totalNumberOfUsers;
  const isOwnResult = (key: string) => {
    return key === ownId;
  };

  const getValue = (key: string) => {
    if (users[key].value === undefined) {
      return "_";
    }

    if (isOwnResult(key)) {
      return users[key].value;
    }

    return disclose ? users[key].value : "?";
  };

  return (
    <div>
      {Object.keys(users).map(key => (
        <Card key={key} color={isOwnResult(key) ? "#c3f7f7" : undefined}>
          <div>
            <div style={{ padding: 16 }}>{users[key].name}</div>
            <div style={{ fontSize: 80 }}>{getValue(key)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

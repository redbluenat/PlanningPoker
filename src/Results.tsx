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

  const getValue = (key: string) => {
    if (!users || !users[key] || users[key].value === undefined) {
      return "_";
    }

    if (key === ownId) {
      return users[key].value;
    }

    return disclose ? users[key].value : "?";
  };

  const extendedUsers = Object.keys(users)
    .map(key => ({ ...users[key], key }))
    .sort((user1, user2) => {
      if (!user1.value) return -1;

      if (!user2.value) return 1;

      const value1 = parseInt(user1.value);
      if (isNaN(value1)) return 1;

      const value2 = parseInt(user2.value);
      if (isNaN(value2)) return -1;

      return value1 - value2;
    });

  return (
    <div>
      {extendedUsers.map(extendedUser => (
        <Card key={extendedUser.key}>
          <div>
            <div style={{ padding: 16 }}>{extendedUser.name}</div>
            <div style={{ fontSize: 80 }}>{getValue(extendedUser.key)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

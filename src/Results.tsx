import React from 'react';
import { Users } from './User';
import { Card } from './Card';

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
    if (!users || !users[key] || users[key].value === undefined) {
      return '_';
    }

    if (isOwnResult(key)) {
      return users[key].value;
    }

    return disclose ? users[key].value : '?';
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

  const minResult = extendedUsers[0].value;
  const maxResult = extendedUsers[extendedUsers.length - 1].value;

  return (
    <div>
      {extendedUsers.map(extendedUser => {
        const isMin = extendedUser.value === minResult;
        const isMax = extendedUser.value === maxResult;

        return (
          <Card
            key={extendedUser.key}
            color={isOwnResult(extendedUser.key) ? '#c3f7f7' : undefined}
          >
            <div>
              <div
                style={{
                  padding: 16,
                  wordWrap: 'break-word',
                  height: '1em',
                  lineHeight: '1em',
                  overflow: 'hidden'
                }}
              >
                {extendedUser.name}
              </div>
              <div
                style={{
                  fontSize: 80,
                  color: disclose && (isMin || isMax) ? 'red' : 'black'
                }}
              >
                {getValue(extendedUser.key)}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

import React from 'react';
import { Users } from './User';
import { Card } from './Card';

interface IProps {
  users: Users;
}

export const Results = ({ users }: IProps) => {
  const numberOfFinishedUsers = Object.keys(users).filter(
    key => !!users[key] && !!users[key].value,
  ).length;
  const totalNumberOfUsers = Object.keys(users).length;
  if (numberOfFinishedUsers < totalNumberOfUsers) {
    return (
      <div>
        {numberOfFinishedUsers} / {totalNumberOfUsers}
      </div>
    );
  }

  return (
    <div>
      {Object.keys(users).map(key => (
        <Card key={key}>
          <div>
            <div style={{ padding: 16 }}>{users[key].name}</div>
            <div style={{ fontSize: 80 }}>{users[key].value}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

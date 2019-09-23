import React from 'react';
import { Card } from './Card';

const values = [
  { value: '0', color: '#fff' },
  { value: '1', color: '#afa' },
  { value: '2', color: '#5f5' },
  { value: '3', color: 'yellow' },
  { value: '5', color: 'orange' },
  { value: '8', color: 'red' },
  { value: '13', color: 'violet' },
  { value: '20', color: '#bbb' },
  { value: '?', color: '#fff' },
];

interface IProps {
  currentSelection: string | undefined;
  onClick: (value: string | undefined) => void;
}

export const Selection = ({ currentSelection, onClick }: IProps) => (
  <div>
    {values.map(({ value, color }) => (
      <Card
        color={
          currentSelection
            ? currentSelection === value
              ? color
              : 'white'
            : color
        }
        size={50}
        onClick={() => onClick(value)}
      >
        <div style={{ fontSize: 35 }}>{value}</div>
      </Card>
    ))}
  </div>
);

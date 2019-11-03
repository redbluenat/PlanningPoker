import React, { ReactElement } from "react";
import { Color } from "csstype";

interface IProps {
  children: ReactElement;
  color?: Color;
  onClick?: () => void;
  size?: number;
}

export const Card = ({ children, color, onClick, size }: IProps) => (
  <div
    className="card"
    style={{
      width: size || 150,
      height: size || 150,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      margin: 8,
      background: color ? color : "#fff",
      display: "inline-block"
    }}
    onClick={onClick}
  >
    {children}
  </div>
);

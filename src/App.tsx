import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import { Users } from './User';
import { Results } from './Results';
import { Selection } from './Selection';
import Uuid from 'pure-uuid';
import { MessageType, CurrentValue } from './Message';
import _ from 'lodash';
import { addUrlProps } from 'react-url-query';

const ownId = new Uuid(4).format();

const mapUrlToProps = (url: any) => {
  return {
    room: url.room,
  };
};

const sendData = (
  socket: WebSocket,
  name: string,
  value: string | undefined,
) => {
  const data: CurrentValue = {
    type: MessageType.CurrentValue,
    clientId: ownId,
    name,
    value,
  };
  socket.send(JSON.stringify(data));
};

interface IProps {
  room: string;
}

const App: React.FC<IProps> = ({ room = 'default' }: IProps) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Users>({
    [ownId]: {
      name: localStorage.getItem('name') || '',
      value: undefined,
    },
  });

  const { name, value } = users[ownId];

  const socket = useMemo(
    () =>
      new WebSocket(
        `wss://connect.websocket.in/PlanningPokerApp?room_id=${room}`,
      ),
    [room],
  );

  const setData = useCallback(
    (name: string, value: string | undefined) => {
      sendData(socket, name, value);
      setUsers(users => ({ ...users, [ownId]: { name, value } }));
    },
    [socket],
  );

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const name = event.target.value;
    localStorage.setItem('name', name);
    setData(name, value);
  };

  const reset = () => {
    setUsers(users =>
      _(users)
        .toPairs()
        .reduce(
          (newUsers, [key, user]) => ({
            ...newUsers,
            [key]: { ...user, value: undefined },
          }),
          {},
        ),
    );
  };

  useEffect(() => {
    window.onunload = () => {
      socket.send(
        JSON.stringify({
          type: MessageType.Leave,
          clientId: ownId,
        }),
      );
    };
  }, [socket]);

  useEffect(() => {
    socket.onopen = () => {
      setLoading(false);
      socket.send(
        JSON.stringify({
          type: MessageType.RequestCurrentValue,
        }),
      );
      sendData(socket, name, value);
    };

    socket.onmessage = event => {
      const message = JSON.parse(event.data);

      if (!message.type) return;

      switch (message.type) {
        case MessageType.CurrentValue: {
          setUsers(users => ({
            ...users,
            [message.clientId]: { name: message.name, value: message.value },
          }));
          break;
        }
        case MessageType.Leave: {
          const clientId = message.clientId;
          const userPairs = _(users)
            .toPairs()
            .filter(([key]) => key !== clientId);
          const newUsers = userPairs.reduce(
            (newUsers, [key, user]) => ({
              ...newUsers,
              [key]: { ...user, value: undefined },
            }),
            {},
          );
          setUsers(newUsers);
          break;
        }
        case MessageType.RequestCurrentValue: {
          sendData(socket, name, value);
          break;
        }
        case MessageType.Reset: {
          reset();
          break;
        }
        default:
          return;
      }
    };

    socket.onclose = event => {};
  }, [name, socket, users, value]);

  if (loading) return <header>Loading ...</header>;

  return (
    <div className="App">
      <div style={{ flexDirection: 'row', margin: 16 }}>
        <label>
          Dein Name:
          <input
            style={{ marginLeft: 16 }}
            value={name}
            onChange={handleNameChange}
          ></input>
        </label>
      </div>

      <div>
        <button
          onClick={() => {
            socket.send(JSON.stringify({ type: MessageType.Reset }));
            reset();
          }}
        >
          Reset
        </button>
      </div>

      <Selection
        currentSelection={value}
        onClick={value => setData(name, value)}
      />

      <Results ownId={ownId} users={users} />
    </div>
  );
};

export default addUrlProps({ mapUrlToProps })(App);

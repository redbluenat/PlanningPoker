import React, { useState, useEffect } from 'react';
import './App.css';
import { Users } from './User';
import { Results } from './Results';
import { Selection } from './Selection';
import Uuid from 'pure-uuid';
import { MessageType, CurrentValue } from './Message';
import _ from 'lodash';

// const initialState: Users = {
//   '1': { name: 'Janina', value: '3' },
//   '2': { name: 'Mr. Bones', value: '2' },
//   '3': { name: 'Felix', value: '5' },
//   '4': { name: 'Patryk', value: '8' },
// };

const ownId = new Uuid(4).format();

const socket = new WebSocket(
  'wss://connect.websocket.in/PlanningPokerApp?room_id=Demo',
);

const sendData = (name: string, value: string | undefined) => {
  const data: CurrentValue = {
    type: MessageType.CurrentValue,
    clientId: ownId,
    name,
    value,
  };
  socket.send(JSON.stringify(data));
};

window.onbeforeunload = () => {
  socket.send(JSON.stringify({
    type: MessageType.Leave,
    clientId: ownId,
  }));
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Users>({
    [ownId]: {
      name: '',
      value: undefined,
    },
  });

  const { name, value } = users[ownId];

  const setData = (name: string, value: string | undefined) => {
    sendData(name, value);
    setUsers(users => ({ ...users, [ownId]: { name, value } }));
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
    socket.onopen = () => {
      setLoading(false);
      socket.send(
        JSON.stringify({
          type: MessageType.RequestCurrentValue,
        }),
      );
      sendData(name, value);
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
          sendData(name, value);
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
  }, [name, users, value]);

  if (loading) return <header>Loading ...</header>;

  return (
    <div className="App">
      <div style={{ flexDirection: 'row', margin: 16 }}>
        <label>
          Dein Name:
          <input
            style={{ marginLeft: 16 }}
            value={name}
            onChange={event => setData(event.target.value, value)}
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

      <Results users={users} />
    </div>
  );
};

export default App;

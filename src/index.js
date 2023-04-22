
import React from 'react';
import ReactDOM from 'react-dom';
import List from './App';

const items = [
  { text: 'Manish' },
  { text: 'Kumar' },
  { text: 'Nirmalkar' },
];

ReactDOM.render(
  <React.StrictMode>
    <List items={items} />
  </React.StrictMode>,
  document.getElementById('root')
);






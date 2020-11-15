import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import Routes from './src/Routes';

LogBox.ignoreLogs(['Unrecognized WebSocket']);

export default function App() {
  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor='#7D40E7' />
      <Routes />
    </>
  );
}
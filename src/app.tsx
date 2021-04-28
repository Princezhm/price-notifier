import { Button } from '@material-ui/core';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { Landing } from './components/landing/landing';

const App = () => {
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key: SnackbarKey) => () => notistackRef.current?.closeSnackbar(key);

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      ref={notistackRef}
      action={(key) => <Button onClick={onClickDismiss(key)}>Dismiss</Button>}
    >
      <Landing />
    </SnackbarProvider>
  );
};

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();

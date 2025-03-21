import { useState } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import { Content, Header } from '@/components';

import './App.scss';

type AppComponent = () => React.ReactNode;

const App: AppComponent = () => {
  const [symbolSelected, setSymbolSelected] = useState<string>('');

  return (
    <div className="app">
      <Header onSymbolSelected={setSymbolSelected} />
      <Content symbolSelected={symbolSelected} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default App;

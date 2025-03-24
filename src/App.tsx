import { useState } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import { Content, Header } from '@/components';
import { ChainSymbol } from '@/library/types';

import './App.scss';

type AppComponent = () => React.ReactNode;

const App: AppComponent = () => {
  const [symbolSelected, setSymbolSelected] = useState<ChainSymbol>(ChainSymbol.ETH);

  return (
    <div className="app">
      <Header onSymbolSelected={setSymbolSelected} />
      <div className="content">
        <Content symbolSelected={symbolSelected} />
      </div>
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

import { useState } from 'react';
import { Content, Header } from '@/components';

import './App.scss';

type AppComponent = () => React.ReactNode;

const App: AppComponent = () => {
  const [symbolSelected, setSymbolSelected] = useState<string>('');

  return (
    <div className="app">
      <Header onSymbolSelected={setSymbolSelected} />
      <Content symbolSelected={symbolSelected} />
    </div>
  );
};

export default App;

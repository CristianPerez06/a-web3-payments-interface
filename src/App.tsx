import { Content, Header } from '@/components';
import { Well } from '@/library/components';

import './App.scss';

type AppComponent = () => React.ReactNode;

const App: AppComponent = () => {
  const handleOnConnect = () => {
    console.log('connect');
  };

  return (
    <div className="app">
      <Header onConnect={handleOnConnect} />
      <Content>
        <Well />
      </Content>
    </div>
  );
};

export default App;

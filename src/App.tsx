import { Content, Header } from '@/components';
import { Well } from '@/library/components';

import './App.scss';

type AppComponent = () => React.ReactNode;

const App: AppComponent = () => {
  return (
    <div className="app">
      <Header />
      <Content>
        <Well />
      </Content>
    </div>
  );
};

export default App;


import './App.css';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import Stock from './components/Stock';

const { Header, Content, Footer } = Layout;


function App() {
  return (
    <div className="App">
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item >Stocks</Menu.Item>
            <Menu.Item >Clients</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            {/* <h2>Welcome to Addcash Stock App</h2> */}
            <Stock />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </div>
  );
}

export default App;

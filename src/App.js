
import './App.css';
import logo from './addcash_logo.png'
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import Stock from './components/Stock';
import Client from './components/Client';
import PurchaseStock from './components/PurchaseStock';
import { useState } from 'react';

const { Header, Content, Footer } = Layout;



function App() {
  const [currentTab, setCurrentTab] = useState("home")

  return (
    <div className="App">
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item onClick={()=> setCurrentTab("home")} >Home</Menu.Item>
            <Menu.Item onClick={()=> setCurrentTab("stocks")} >Stocks</Menu.Item>
            <Menu.Item onClick={()=> setCurrentTab("clients")}>Clients</Menu.Item>
            <Menu.Item onClick={()=> setCurrentTab("purchases")}>Purchase stock</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            { currentTab === "home" && (
              
              <div>
                <h1 style={{fontSize: "28px"}}>Welcome to Adcash Stock App</h1>
                <img src={logo} alt='logo'/>
              </div>
            )}

            {currentTab === "stocks" && <Stock />}
            { currentTab === "clients" && <Client />}
            {currentTab === "purchases" && <PurchaseStock />}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </div>
  );
}

export default App;

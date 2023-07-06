import {
    CloseOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LoginOutlined,
    ShoppingCartOutlined,
    HeartFilled,
    EnvironmentFilled,
    UndoOutlined,
    SettingFilled,
    PhoneFilled,
    DollarCircleFilled,
    SearchOutlined,
    MessageOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Badge } from 'antd';
import { Layout, theme } from 'antd';
import React, { useState,forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from '../pages/Home';
const { Header, Sider, Content } = Layout;
const DefaultLayout = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [cartCount, setcartCount] = useState(0);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

const navigateToCart = ()=>{
    navigate('/YourBasket');
}

const getCartCount = ()=>{
    axios.get('/api/products/cartListCount')
    .then((res)=>{
        setcartCount(res.data[0].CARTCOUNT)
    })
    .catch((error)=>{
        console.log(error)
    })
}
(()=>{
    getCartCount();
})()
  useImperativeHandle(ref, () => ({
    getCartCount
  }));
    return (
        
        <Layout>
            
            <Sider trigger={null} collapsible collapsed={collapsed}
                style={{ position: 'sticky', overflow: 'auto', height: '100%', top: 0 }}>
                <div className="logo" >
                    <div className='close'>
                        <CloseOutlined />
                    </div>
                    <div className='profile-pic'>
                        <Avatar icon={<UserOutlined />} />
                    </div>
                </div>
                <div className='list bs'>

                    <div className='first-list'>
                        <Menu
                            theme="light"
                            mode="inline"
                            defaultSelectedKeys={[window.location.pathname]}
                        >
                            {/* <Menu.Item key="/" icon={<HomeOutlined />}>
                                <Link to="/">Home</Link>
                            </Menu.Item> */}
                            <Menu.Item key="/signup" icon={<LoginOutlined />}>
                                <Link to="/signup">Sign In / Sign Up</Link>
                            </Menu.Item>
                            <Menu.Item key="/deals" icon={<DollarCircleFilled />}>
                                <Link to="/deals">Deals</Link>
                            </Menu.Item>
                            <hr />
                            <Menu.Item key="/yourbasket" icon={<ShoppingCartOutlined />}>
                                <Link to="/yourbasket">Your Basket</Link>
                            </Menu.Item>

                        </Menu>
                    </div>

                </div>
                <div className='list bs'>
                    <div className='first-list'>
                        <Menu
                            theme="light"
                            mode="inline"
                            defaultSelectedKeys={[window.location.pathname]}
                        >
                            <Menu.Item key="/favourite" icon={<HeartFilled />}>
                                <Link to="/favourite">Favourites</Link>
                            </Menu.Item>
                            <hr />
                            <Menu.Item key="/locations" icon={<EnvironmentFilled />}>
                                <Link to="/locations">Locations</Link>
                            </Menu.Item>
                            <Menu.Item key="/previousorders" icon={<UndoOutlined />}>
                                <Link to="/previousorders">Previous Orders</Link>
                            </Menu.Item>

                        </Menu>
                    </div>
                </div>
                <div className='list bs'>
                    <div className='first-list'>
                        <Menu
                            theme="light"
                            mode="inline"
                            defaultSelectedKeys={[window.location.pathname]}
                        >
                            <Menu.Item key="/setting" icon={<SettingFilled />}>
                                <Link to="/setting">Settings</Link>
                            </Menu.Item>
                            <hr />
                            <Menu.Item key="/contact" icon={<PhoneFilled />}>
                                <Link to="/contact">Contact Us</Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        position: 'sticky', overflow: 'auto', top: 0, zIndex: 3
                    }}
                >
                    <div className="flex header">
                        <div>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </div>
                        <div className='title'>
                            <h2>Kimson</h2>
                        </div>

                        <div className="input-group search">
                            <input type="text" className="form-control" placeholder="Search Product" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            <span>
                                <SearchOutlined />
                            </span>
                        </div>
                        <div className='fonticon'>
                            <span>
                                <DollarCircleFilled />
                            </span>
                        </div>
                        <div className='fonticon'>
                            <span>
                            <Badge count={cartCount}><ShoppingCartOutlined onClick={navigateToCart} /></Badge>
                            </span>
                        </div>
                        <div className='fonticon'>
                            <span>
                                <MessageOutlined />
                            </span>
                        </div>

                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    );
});
export default DefaultLayout;
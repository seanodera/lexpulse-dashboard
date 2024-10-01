import {Layout, Menu} from 'antd';
import {
    DashboardOutlined,
    CalendarOutlined,
    FileTextOutlined,
    DollarOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import {useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false); // State to control sidebar collapse
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <Layout.Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            trigger={null}
            className={'flex flex-col h-screen'}

        >
            {/* Logo section */}
            <div className={'flex items-center p-4 justify-center'}>
                <img src="/logo.svg" alt="Lexpulse Logo" width={collapsed ? 40 : 50} height={50}/>
                {!collapsed && (
                    <span className={'text-white font-bold text-xl ms-2.5'}>
                        Lexpulse
                    </span>
                )}
            </div>

            {/* Menu items */}
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                onClick={(item) => {
                    navigate(item.key);
                }}
                items={[
                    {
                        key: '/',
                        icon: <DashboardOutlined/>,
                        label: 'Dashboard',
                    },
                    {
                        key: '/create-event',
                        icon: <CalendarOutlined/>,
                        label: 'Create Event',
                    },
                    {
                        key: '/manage-events',
                        icon: <FileTextOutlined/>,
                        label: 'Manage Events',
                    },
                    // {
                    //     key: '/manage-venue',
                    //     icon: <AppstoreOutlined />,
                    //     label: 'Manage Venue',
                    // },
                    // {
                    //     key: '/sales-reports',
                    //     icon: <DollarOutlined/>,
                    //     label: 'Sales Reports',
                    // },
                    {
                        key: '/payouts',
                        icon: <DollarOutlined/>,
                        label: 'Payouts',
                    },
                    {
                        key: '/settings',
                        icon: <SettingOutlined/>,
                        label: 'Settings',
                    },
                    {
                        key: '/logout',
                        icon: <LogoutOutlined/>,
                        label: 'Logout',
                        onClick: () => {}
                    },
                ]}
            />
        </Layout.Sider>
    );
}
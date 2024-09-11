import {Dropdown, Avatar} from 'antd';
import {UserOutlined, SettingOutlined, LogoutOutlined} from '@ant-design/icons';

const ProfileDropdown = () => {

    return (
        <Dropdown  menu={{
            items: [
                {
                    key: 1,
                    icon: <UserOutlined/>,
                    label: 'Profile'
                },
                {
                    key: 2,
                    icon: <SettingOutlined/>,
                    label: 'Settings'
                },
                {
                    key: 3,
                    icon: <LogoutOutlined/>,
                    label: ' Logout'
                }
            ]
        }} trigger={['click']}>
            <div className="flex gap-2 items-center cursor-pointer">
                {/* Profile Avatar */}
                <Avatar size="large" icon={<UserOutlined/>}/>

                {/* Name and Email */}
                <div className="flex flex-col">
                    <span className="text-white font-semibold">Sean Odera</span>
                    <span className="text-sm text-gray-400">seanolero@outlook.com</span>
                </div>
            </div>
        </Dropdown>
    );
};

export default ProfileDropdown;
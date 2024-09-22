import {Dropdown, Avatar} from 'antd';
import {UserOutlined, SettingOutlined, LogoutOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks.ts";
import {logout, selectCurrentUser} from "../../data/slices/authSlice.ts";

const ProfileDropdown = () => {
   const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectCurrentUser);
    if (!user) {
        return <div></div>
    }

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
                    label: ' Logout',
                    onClick: () => {
                        dispatch(logout())
                        navigate('/login');
                    },
                    danger:true
                }
            ]
        }} trigger={['click']}>
            <div className="flex gap-2 items-center cursor-pointer">
                {/* Profile Avatar */}
                <Avatar size="large" icon={<UserOutlined/>}/>

                {/* Name and Email */}
                <div className="flex flex-col">
                    <span className="text-white font-semibold">{user.firstName} {user.lastName}</span>
                    <span className="text-sm text-gray-400">{user.email}</span>
                </div>
            </div>
        </Dropdown>
    );
};

export default ProfileDropdown;
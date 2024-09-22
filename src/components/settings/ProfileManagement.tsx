import {Card, Tag,} from 'antd';
import {useAppSelector} from "../../hooks/hooks.ts";
import {selectCurrentUser} from "../../data/slices/authSlice.ts";



const ProfileManagement = () => {
    const user = useAppSelector(selectCurrentUser)

    if (!user) {
        return <div></div>
    }
    return (
        <Card>
            <h3 className={'text-lg font-semibold'}>Profile Management</h3>
            <div className={'grid grid-cols-5'}>
                <div>
                    <img src={user.image ? user.image[0] : ''} className={'rounded-lg aspect-square w-full'}/>
                </div>
                <div className={'col-span-2 space-y-3'}>
                    <div className={'grid grid-cols-2'}>
                        <div>
                            <h4 className={'font-semibold '}>First Name</h4>
                            <h3>{user.firstName}</h3>
                        </div>
                        <div>
                            <h4 className={'font-semibold'}>Last Name</h4>
                            <h3>{user.lastName}</h3>
                        </div>
                    </div>
                    <div>
                        <h4 className={'font-semibold'}>Email</h4>
                        <h3 >{user.email} <Tag
                            color={user.activatedEmail ? 'success' : 'red'}>{user.activatedEmail ? 'verified' : 'unverified'}</Tag>
                        </h3>
                    </div>
                    <div>
                        <h4 className={'font-semibold'}>Phone Number</h4>
                        <h3>{user.phone}</h3>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileManagement;
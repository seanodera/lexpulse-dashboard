import { Card, } from 'antd';
import ProfileManagement from "../components/settings/ProfileManagement.tsx";


export default function SettingsPage() {


    return (
       <div className={'p-4 space-y-4'}>
           <div>
               <ProfileManagement/>
           </div>

           <Card>

           </Card>
       </div>
    );
}
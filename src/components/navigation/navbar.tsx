import { Layout } from 'antd';
import ProfileDropdown from './profileDropdown';
import {useLocation} from "react-router-dom";
import _ from "lodash"; // Import the profile dropdown component

export default function Navbar() {
    const location = useLocation().pathname;
    return (
        <Layout.Header className="px-4 bg-dark text-white py-1 flex justify-between items-center leading-none">
            {/* Dashboard title */}
            <div>
                <h1 className="my-0 font-semibold text-2xl">{location == '/'? 'Dashboard' : _.startCase(location.split('/').reverse()[0])}</h1>
            </div>

            {/* Profile and dropdown */}
            <ProfileDropdown />
        </Layout.Header>
    );
}
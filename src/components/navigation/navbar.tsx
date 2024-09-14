import { Layout } from 'antd';
import ProfileDropdown from './profileDropdown';
import Breadcrumbs from "./breadcrumbs.tsx"; // Import the profile dropdown component

export default function Navbar() {

    return (
        <Layout.Header className="px-4 bg-dark text-white py-1 flex justify-between items-center leading-none">
            {/* Dashboard title */}
            <div className="flex items-center gap-2">
                <Breadcrumbs/>
            </div>

            {/* Profile and dropdown */}
            <ProfileDropdown/>
        </Layout.Header>
    );
}
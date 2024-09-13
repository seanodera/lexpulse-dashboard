
import {Outlet} from "react-router-dom";
import {Layout} from "antd";
import Sidebar from "../components/navigation/sidebar.tsx";
import Navbar from "../components/navigation/navbar.tsx";

const {Content} = Layout;
export default function MainShell() {


    return <Layout hasSider>
        <Sidebar/>
        <Layout className={'h-screen'}>
            <Navbar/>
            <Content className={'overflow-auto'}>
                <Outlet/>
            </Content>
        </Layout>
    </Layout>
}
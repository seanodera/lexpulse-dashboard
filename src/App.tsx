import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "./screens/home";
import MainShell from "./shells/mainShell";
import {ConfigProvider} from "antd";
import {useEffect, useState} from "react";
import {darkColors, primaryColor} from "../colors";
import CreateEventScreen from "./screens/createEvent";
import ManageEvent from "./screens/manageEvent";
import SingleEventScreen from "./screens/singleEvent";
import EditEventScreen from "./screens/editEvent";
import {fetchEvents} from "./data/slices/EventSlice";
import {useAppDispatch} from "./hooks/hooks";
import LoginPage from "./screens/login";
import {fetchTransactions} from "./data/slices/transactionSlice.ts";
import SettingsPage from "./screens/settings.tsx";
import PayoutsPage from "./screens/payouts.tsx";
import SalesReport from "./screens/reports.tsx";

function App() {
    const dispatch = useAppDispatch();
    const [isDarkMode] = useState<boolean>(false);
    const navigate = useNavigate();

    const lightTheme = {
        token: {
            colorPrimary: primaryColor['500'],
            colorTextBase: '#000000',
            colorBgBase: '#ffffff',
            colorInfo: primaryColor['500'],
        },
        components: {
            Layout: {
                siderBg: darkColors.dark,
            },
            Menu: {
                darkItemBg: darkColors.dark,
            },
            Select: {
                clearBg: "rgba(255,255,255,0)",
                selectorBg: "rgba(255,255,255,0)",
            },
        },
    };

    const darkTheme = {
        token: {
            colorPrimary: primaryColor['700'],
            colorTextBase: '#E4E4E4',
            colorBgBase: darkColors.dark,
            colorBgContainer: '#1F1F1F',
            colorInfo: primaryColor['500'],
        },
        components: {
            Layout: {
                siderBg: darkColors.dark,
            },
        },
    };

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    useEffect(() => {
        if (token && user) {

            dispatch(fetchEvents(JSON.parse(user).id));
            dispatch(fetchTransactions(JSON.parse(user).id))
        } else {
            navigate('/login');
        }
    }, [token, user]);

    return (
        <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<MainShell />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-event" element={<CreateEventScreen />} />
                    <Route path="/sales-reports" element={<SalesReport />} />
                    <Route path="/payouts" element={<PayoutsPage />} />
                    <Route path="/settings" element={<SettingsPage/>} />
                    <Route path="/manage-events" element={<ManageEvent />} />
                    <Route path="/manage-events/:id" element={<SingleEventScreen />} />
                    <Route path="/manage-events/:id/edit" element={<EditEventScreen />} />
                </Route>
            </Routes>
        </ConfigProvider>
    );
}

export default App;
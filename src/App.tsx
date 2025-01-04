import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "./screens/home";
import MainShell from "./shells/mainShell";
import {useEffect} from "react";
import CreateEventScreen from "./screens/createEvent";
import ManageEvent from "./screens/manageEvent";
import SingleEventScreen from "./screens/singleEvent";
import EditEventScreen from "./screens/editEvent";
import {useAppDispatch} from "./hooks/hooks";
import LoginPage from "./screens/login";
import SettingsPage from "./screens/settings.tsx";
import PayoutsPage from "./screens/payouts.tsx";
import SalesReport from "./screens/reports.tsx";
import {autoLoginUserAsync} from "./data/slices/authSlice.ts";
import ManageVenueScreen from "./screens/manageVenue.tsx";
import CreateVenueScreen from "./screens/createVenue.tsx";
import SingleVenueScreen from "./screens/singleVenue.tsx";
import ContextProvider from "./shells/ContextProvider.tsx";

function App() {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        async function initialize(){
            await dispatch(autoLoginUserAsync()).then((value) => {
                if (value.meta.requestStatus === 'rejected'){
                    navigate('/login');
                }
            })
        }
        initialize();
    }, [dispatch, navigate]);

    return (
        <ContextProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<MainShell />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-event" element={<CreateEventScreen />} />
                    <Route path="/sales-reports" element={<SalesReport />} />
                    <Route path="/payouts" element={<PayoutsPage />} />
                    <Route path="/settings" element={<SettingsPage/>} />
                    <Route path="/manage-venue" element={<ManageVenueScreen />} />
                    <Route path="/create-venue" element={<CreateVenueScreen />} />
                    <Route path="/manage-venue/:id" element={<SingleVenueScreen />} />
                    <Route path="/manage-events" element={<ManageEvent />} />
                    <Route path="/manage-events/:id" element={<SingleEventScreen />} />
                    <Route path="/manage-events/:id/edit" element={<EditEventScreen />} />
                </Route>
            </Routes>
        </ContextProvider>
    );
}

export default App;

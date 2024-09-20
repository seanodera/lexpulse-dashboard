import { useEffect } from "react";
import SingleEventBanner from "../components/event/banner.tsx";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import TicketTab from "../components/event/tickets.tsx";
import { useAppDispatch, useAppSelector } from "../hooks/hooks.ts";
import { fetchEventById, selectFocusEvent } from "../data/slices/EventSlice.ts";
import OverviewTab from "../components/event/overviewTab.tsx";
import ManageScanners from "../components/event/manageScanners.tsx";

Chart.register(ArcElement, Tooltip, Legend);

export default function SingleEventScreen() {
    const { id } = useParams();
    const event = useAppSelector(selectFocusEvent);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            dispatch(fetchEventById(id));
        }
    }, [id, dispatch]);

    const getActiveKeyFromLocation = () => {
        const params = new URLSearchParams(location.search);
        return params.get('tab') || 'overview'; // Default to 'overview' if no tab is specified
    };

    const handleTabChange = (key: string) => {
        const params = new URLSearchParams(location.search);
        params.set('tab', key);
        navigate({ search: params.toString() });
    };



    console.log(event);
    if (!event) {
        return <div></div>;
    }

    return (
        <div>
            <SingleEventBanner event={event} />
            <Tabs
                size="large"
                className="px-4"
                activeKey={getActiveKeyFromLocation()} // Set the active tab based on the URL query parameter
                onChange={handleTabChange} // Change the URL query parameter when the tab changes
                defaultActiveKey="overview"
                items={[
                    {
                        key: 'overview',
                        label: 'Overview',
                        children: <OverviewTab event={event} />,
                    },
                    {
                        key: 'tickets',
                        label: 'Tickets',
                        children: <TicketTab event={event} />,
                    },
                    {
                        key: 'scanners',
                        label: 'Scanners',
                        children: <ManageScanners event={event}/>
                    },
                ]}
            />
        </div>
    );
}
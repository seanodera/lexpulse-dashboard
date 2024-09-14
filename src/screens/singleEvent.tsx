import {useEffect, useState} from "react";
import {EventModel, Ticket, Venue} from "../data/types.ts";
import {generateVenues} from "../data/generator.ts";
import SingleEventBanner from "../components/event/banner.tsx";
import {useParams} from "react-router-dom";
import {Button, Card, Tabs, Typography} from "antd";
import {Doughnut} from "react-chartjs-2";
import {ArcElement, Chart, Legend, Tooltip} from "chart.js";
import TicketTab from "../components/event/tickets.tsx";
import {contrastRatio, extractImageColors} from "../data/palette.ts";
import {useAppDispatch, useAppSelector} from "../hooks/hooks.ts";
import {fetchEventById, selectFocusEvent} from "../data/slices/EventSlice.ts";


Chart.register(ArcElement, Tooltip, Legend);

export default function SingleEventScreen() {
    const {id} = useParams();
    const event = useAppSelector(selectFocusEvent);
    const dispatch = useAppDispatch();
    useEffect(() => {

        if (id) {
            dispatch(fetchEventById(id))
        }

    }, [id])

    console.log(event)
    if (!event) {
        return <div></div>
    }

    return <div>
        <SingleEventBanner event={event}/>
        <Tabs size={'large'} className={'px-4'} defaultActiveKey="1" items={[
            {
                key: '1',
                label: 'Overview',
                children: <OverviewTab event={event}/>
            },
            {
                key: '2',
                label: 'Tickets',
                children: <TicketTab event={event}/>,
            }
        ]}/>
    </div>
}


export function OverviewTab({event}: { event: EventModel }) {
    const [colors, setColors] = useState<string[]>([]);
    const [venue, setVenue] = useState<Venue>();
    // Aggregate sold and total counts from tickets
    const aggregateTickets = (tickets: Ticket[]) => {
        return tickets.reduce(
            (acc, ticket) => {
                acc.sold += ticket.sold;
                acc.total += ticket.ticketsAvailable;
                return acc;
            },
            {sold: 0, total: 0}
        );
    };

    const {sold, total} = aggregateTickets(event.ticketInfo);

    useEffect(() => {
        async function genColors() {
            let _colors = await extractImageColors(event.poster);

            const newColors = await extractImageColors(event.cover);
            _colors = [..._colors, ...newColors];

            _colors.filter((value) => contrastRatio(value, {
                red: 255, green: 255, blue: 255, saturation: 1,
                hex: "#FFFFFF",
                area: 0,
                hue: 0,
                lightness: 0,
                intensity: 0
            }) > 4.5);

            _colors.sort((a, b) => {
                return b.saturation - a.saturation;
            });
            if (_colors.length > event.ticketInfo.length - 1) {
                _colors = _colors.slice(0, event.ticketInfo.length);
            }
            console.log(_colors.length, event.ticketInfo.length);

            setColors([..._colors.map((c) => c.hex), '#6b7280']);
        }

        if (event.venue.saved && event.venue.id) {
            setVenue(generateVenues(1, {id: event.venue.id})[ 0 ]);
        }
        genColors();
    }, [event]);

    const data = {
        labels: [...event.ticketInfo.map(ticket => ticket.ticketType), 'Unsold'],
        datasets: [
            {
                label: 'Tickets',
                data: [...event.ticketInfo.map(ticket => ticket.sold).sort((b, a) => a - b), total - sold],
                backgroundColor: colors,
                hoverBackgroundColor: colors,
            },
        ],
    };

    return <div>
        <div className={'grid grid-cols-3 gap-8'}>
            <div className={'col-span-2 space-y-8'}>
                <div className={'bg-white rounded-lg p-4'}>
                    <h3 className={'text-xl font-semibold mb-1'}>Description</h3>
                    <Typography.Paragraph ellipsis={{
                        rows: 3, expandable: 'collapsible',
                    }}>{event.description}</Typography.Paragraph>
                </div>
                <div className={'bg-white rounded-lg p-4'}>
                    <h3 className={'text-xl font-semibold mb-2'}>Venue Details</h3>
                    <div className={'grid grid-cols-2 gap-8'}>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue Name</h4>
                            <h3 className={'font-semibold'}>{event.venue.name}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue Saved</h4>
                            <h3 className={'font-semibold'}>{event.venue.saved ? 'Registered' : 'No'}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue Street</h4>
                            <h3 className={'font-semibold'}>{event.venue.street}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue District</h4>
                            <h3 className={'font-semibold'}>{event.venue.district}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue City</h4>
                            <h3 className={'font-semibold'}>{event.venue.city}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue Country</h4>
                            <h3 className={'font-semibold'}>{event.venue.country}</h3>
                        </div>
                        {venue && <div className={'col-span-2 grid grid-cols-2 gap-8'}>

                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Venue Capacity</h4>
                                <h3 className={'font-semibold'}>{venue.capacity} People</h3>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Venue Followers</h4>
                                <h3 className={'font-semibold'}>{venue.followers}</h3>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Venue Email</h4>
                                <h3 className={'font-semibold'}>{venue.email}</h3>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Venue Phone</h4>
                                <h3 className={'font-semibold'}>{venue.phone}</h3>
                            </div>
                            <div className={'col-span-2'}>
                                <h4 className={'text-gray-500 font-medium'}>Venue Links</h4>
                                <div className={'flex gap-2 items-center'}>
                                    <Button href={`https://lexpulse-web.vercel.app/venue/${venue.id}`} type={'link'}
                                            className={'text-primary'}>Venue Page</Button>
                                    {venue.links.map(link => <Button href={link.url} type={'link'}
                                                                     className={'text-dark'}>{link.name}</Button>)}
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>

                <div>

                </div>
            </div>
            <div>
                <Card title={'Tickets Insight'}>
                    <Doughnut data={data}/>
                </Card>
            </div>
        </div>
    </div>
}


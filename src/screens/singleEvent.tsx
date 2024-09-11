import {useEffect, useState} from "react";
import {EventModel} from "../data/types.ts";
import {generateEvents} from "../data/generator.ts";
import SingleEventBanner from "../components/event/banner.tsx";
import {useParams} from "react-router-dom";
import {Button, Tabs, Tag} from "antd";
import moment from "moment";


export default function SingleEventScreen() {
    const {id} = useParams();
    const [event, setEvent] = useState<EventModel>();
    useEffect(() => {
        const _event = generateEvents(1)[ 0 ];
        if (id) {
            _event.id = id;
        }
        setEvent(_event)
    }, [id])
    if (!event) {
        return <div></div>
    }

    return <div>
        <SingleEventBanner event={event}/>
        <Tabs size={'large'}  className={'px-4'} defaultActiveKey="1" items={[
            {
                key: '1',
                label: 'Overview',
            },
            {
                key: '2',
                label: 'Tickets',
                children: <TicketTab event={event}/>,
            }
        ]} />
    </div>
}


export function TicketTab({event}: {event: EventModel}) {
    const [editMode, setEditMode] = useState<boolean>(false)
    return <div>
        <div className={'flex justify-between'}>
            <div className={'flex items-center gap-2'}>
                <h2 className={'font-semibold text-xl my-0'}>Tickets</h2>
                {editMode && <Tag color={'processing'}>Edit Mode</Tag>}
            </div>
            <Button onClick={() => setEditMode(!editMode)} ghost type={'primary'} danger={editMode} >{editMode? 'Cancel' : 'Edit'}</Button>
        </div>
        <div className={'grid grid-cols-3 gap-8 mt-4'}>
            {event.tickets.map((ticket, index) => <div key={index} className={'rounded-lg shadow bg-white p-4'}>
                <div className={'flex items-start justify-between'}>
                    <div>
                        <h4 className={'text-gray-500'}>Ticket Name</h4>
                        <h3 className={'font-semibold mb-1'}>{ticket.name}</h3>
                    </div>
                    <Button danger hidden={!editMode}>Remove</Button>
                </div>
                <div className={'grid grid-cols-2'}>
                    <div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Ticket Price</h4>
                            <h3 className={'font-semibold mb-1'}>GHS {ticket.price}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Tickets Stock</h4>
                            <h3 className={'font-semibold mb-1'}>{ticket.stock}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Tickets Sold</h4>
                            <h3 className={'font-semibold mb-1'}>{ticket.sold}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Sales Close Date</h4>
                            <h3 className={'font-semibold mb-1'}>{moment(ticket.saleEnd || event.date).format('EEE MMM dd, YYYY')}</h3>
                        </div>
                    </div>
                    <div className={'flex flex-col items-center justify-center'}>
                        <div>
                            <h3 className={'text-gray-500 font-medium'}>Revenue</h3>
                            <h2 className={'text-lg font-semibold'}>GHS {(ticket.price * ticket.sold).toFixed(2)}</h2>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    </div>
}
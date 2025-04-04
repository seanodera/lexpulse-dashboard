import {addHours, format} from "date-fns";
import {Dropdown, Tag} from "antd";
import {EventModel} from "../../data/types.ts";
import {
    CloseCircleOutlined,
    FileTextOutlined,
    ShareAltOutlined,
    UserSwitchOutlined
} from "@ant-design/icons";

import {Link} from "react-router-dom";
import {deleteEventById} from "../../data/slices/EventSlice.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks.ts";
import {selectCurrentUser} from "../../data/slices/authSlice.ts";


export default function SingleEventBanner({event}: { event: EventModel }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    return <div className={'bg-cover bg-center bg-no-repeat shadow'} style={{
        backgroundImage: `url("${event.cover}")`
    }}>
        <div className={'py-8 px-16 backdrop-blur bg-dark bg-opacity-30 text-white grid grid-cols-4 gap-8'}>
            <img
                src={event.poster}
                className={'w-full aspect-square object-cover rounded-lg border-solid border-white max-w-screen-sm'}
                alt={'poster'}
            />
            <div className={'col-span-3'}>
                <div className={'flex justify-between items-center w-full'}>
                    <h1 className={'text-3xl font-semibold capitalize'}>{event.eventName}</h1>
                    <div>
                        <Dropdown.Button disabled={event.eventHostId !== user?.id}
                                         buttonsRender={([leftButton, rightButton]) => [<Link className={'block'}
                                                                                              to={`/manage-events/${event._id}/edit`}>{leftButton}</Link>, rightButton]}
                                         type={'primary'} menu={{
                            items: [
                                {
                                    key: 0,
                                    label: 'Share',
                                    icon: <ShareAltOutlined/>
                                },
                                {
                                    key: 1,
                                    label: 'GuestList',
                                    icon: <UserSwitchOutlined/>
                                },
                                // {
                                //     key: 2,
                                //     label: 'Manage Scanners',
                                //     icon: <SettingOutlined/>
                                // },
                                {
                                    key: 3,
                                    label: 'Get Report',
                                    icon: <FileTextOutlined/>,
                                    disabled: event.eventHostId !== user?.id,
                                },
                                {
                                    key: 4,
                                    label: 'Cancel Event',
                                    icon: <CloseCircleOutlined/>,
                                    danger: true,
                                    disabled: event.eventHostId !== user?.id,
                                    onClick: () => (event.ticketSales > 0) && dispatch(deleteEventById(event._id))
                                }
                            ]
                        }}>
                            Edit Event
                        </Dropdown.Button>
                    </div>
                </div>
                <div className={'grid grid-cols-3 gap-8'}>
                    <div className={'mt-3'}>
                        <h4 className={'text-gray-300 font-medium'}>Date</h4>
                        <h3 className={'font-semibold mb-1'}>{format(event.eventDate, 'EEE, dd MMM yyyy')}</h3>
                        <p>{format(event.eventDate, 'HH:mm')} - {format(addHours(event.eventDate, 5), 'HH:mm')}</p>
                    </div>

                    <div className={'mt-3'}>
                        <h4 className={'text-gray-300 font-medium'}>Venue</h4>
                        <h3 className={'font-semibold mb-1 capitalize'}>{event.venue.name} </h3>
                        <p>{event.venue.street}, {event.location}</p>
                    </div>
                    <div>
                        <h4 className={'text-gray-300 font-medium'}>Create At</h4>
                        <h3 className={'font-semibold'}>{format(event.createdAt, 'EEE, dd MMM yyyy HH:mm')}</h3>
                    </div>
                    <div>
                        <h4 className={'text-gray-300 font-medium'}>Event Type</h4>
                        <Tag color={'processing'} className={'font-semibold capitalize my-1'}>{event.category}</Tag>
                    </div>
                    <div>
                        <h4 className={'text-gray-300 font-medium'}>Genre</h4>
                        <div className={'flex flex-wrap gap-1'}>
                            <Tag color={'processing'}>Rock</Tag>
                            <Tag color={'processing'}>hip-hop</Tag>

                        </div>
                    </div>
                    <div>
                        <h4 className={'text-gray-300 font-medium'}>Ticket Sales Closing</h4>
                        <div>{format(event.endSalesDate ? event.endSalesDate : event.eventDate, 'EEE dd MMM YYY, HH:mm')}</div>
                    </div>
                    <div>
                        <h4 className={'text-gray-300'}>minimum Age</h4>
                        <h4>{event.minAge}+</h4>
                        <h4 className={'text-primary'}>{event.minAge && event.minAge >= 18 ? 'Id Required' : ''}</h4>
                    </div>
                    <div>
                        <h4 className={'text-gray-300'}>Dress Code</h4>
                        <h4>{event.dress}</h4>
                    </div>
                    <div>
                        <h4 className={'text-gray-300'}>Last Entry</h4>
                        <h4>{event.lastEntry || 'Anytime'}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
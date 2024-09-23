import {EventModel} from "../data/types.ts";
import {Button, Dropdown, Tag} from "antd";
import {EllipsisOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {useAppSelector} from "../hooks/hooks.ts";
import {selectCurrentUser} from "../data/slices/authSlice.ts";


export default function EventComponent({event}: {event: EventModel}) {
const user = useAppSelector(selectCurrentUser);
const navigate = useNavigate();
console.log(user?.id, event.eventHostId, event.eventHostId === user?.id)
    return (
        <Link className={'block text-current hover:text-current'} to={`/manage-events/${event._id}`}>
            <div className={'relative'}>
                <img src={event.poster} className={'aspect-square object-cover w-full rounded-lg'}/>
                <div className={'absolute right-0 top-0 m-3'}>
                    <Dropdown menu={{items: [
                            {
                                key: 0,
                                label: 'View',
                                onClick: () => {}
                            },
                            {
                                key: 1,
                                label: 'Edit ',
                                disabled: event.eventHostId !== user?.id,
                                onClick: () => {
                                    navigate(`/manage-events/${event._id}/edit`)
                                }
                            },
                            {
                                key: 2,
                                label: 'Promote',
                            },
                            {
                                key: 3,
                                label: 'Disable',
                                danger: true,
                                disabled: event.eventHostId !== user?.id,
                            }
                        ]}}>
                        <Button onClick={(e) => e.preventDefault()} type={'primary'} icon={<EllipsisOutlined/>}/>
                    </Dropdown>
                </div>
            </div>
            <div>
                <h2 className={'font-semibold text-xl capitalize'}>{event.eventName}</h2>
                <Tag color={'processing'}>{event.category}</Tag>
                <p className={'line-clamp-2'}>{event.description}</p>
                <Button type={'primary'}>View</Button>
            </div>
        </Link>
    );
}
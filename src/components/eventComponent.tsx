import {EventModel} from "../data/types.ts";
import {Button, Dropdown, Tag} from "antd";
import {EllipsisOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";


export default function EventComponent({event}: {event: EventModel}) {

    return (
        <Link className={'block text-current hover:text-current'} to={`/manage-events/${event.id}`}>
            <div className={'relative'}>
                <img src={event.poster} className={'aspect-square object-cover w-full rounded-lg'}/>
                <div className={'absolute right-0 top-0 m-3'}>
                    <Dropdown menu={{items: [
                            {
                                key: 0,
                                label: 'view',
                                onClick: () => {}
                            },
                            {
                                key: 1,
                                label: 'edit',
                            },
                            {
                                key: 2,
                                label: 'promote'
                            },
                            {
                                key: 3,
                                label: 'disable',
                                danger: true,
                            }
                        ]}}>
                        <Button type={'primary'} icon={<EllipsisOutlined/>}/>
                    </Dropdown>
                </div>
            </div>
            <div>
                <h2 className={'font-semibold text-xl capitalize'}>{event.name}</h2>
                <Tag color={'purple'}>{event.category}</Tag>
                <p className={'line-clamp-2'}>{event.description}</p>
                <Button type={'primary'}>View</Button>
            </div>
        </Link>
    );
}
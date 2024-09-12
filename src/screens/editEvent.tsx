import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {EventModel, EventType} from "../data/types.ts";
import {generateEvents} from "../data/generator.ts";
import {Button, DatePicker, Tag, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {Input, Select} from "@headlessui/react";
import {format} from "date-fns";

const eventCategories = Object.keys(EventType);

export default function EditEventScreen() {
    const {id} = useParams();
    const inputCls = 'block border-solid border-gray-500 placeholder-white bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
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
        <div className={'bg-cover bg-center bg-no-repeat shadow'} style={{
            backgroundImage: `url("${event.cover}")`
        }}>
            <div className={'py-8 px-16 backdrop-blur bg-dark bg-opacity-60 text-white w-full '}>
                <div className={'flex justify-between items-center w-full'}>
                    <div className={'max-w-sm'}>
                        <h4>Event Name</h4>
                        <Input className={inputCls}/>
                    </div>
                    <div className={'flex gap-2'}>
                        <Button type={'default'} ghost>Change Cover</Button>
                        <Button type={'primary'}>Save Changes</Button>
                    </div>
                </div>
                <div className={'grid grid-cols-4 mt-4 gap-8 w-full'}>
                    <Upload
                        // beforeUpload={(file) => handleImageUpload(file, setFieldValue, 'poster')}
                        showUploadList={false}
                        itemRender={(_originNode, file) => {

                            return <img src={URL.createObjectURL(file.originFileObj as File)}
                                        className={'w-full aspect-square rounded-lg'} alt={''}/>
                        }}
                    >
                        {!event.poster ? (
                            <img src={event.poster} alt="poster" className="w-full aspect-square rounded-xl"/>
                        ) : (
                            <Button icon={<UploadOutlined/>}>Upload Poster</Button>
                        )}
                    </Upload>
                    <div className={'col-span-3 grid grid-cols-3 gap-8'}>
                        <div>
                            <h4>Event Date</h4>
                            <DatePicker format={'dddd MMM DD, YYYY '} className={inputCls}/>
                        </div>
                        <div className={'mt-3'}>
                            <h4 className={'text-gray-300 font-medium'}>Venue</h4>
                            <h3 className={'font-semibold mb-1 capitalize'}>{event.venue.name} </h3>
                            <p>{event.venue.street}, {event.location}</p>
                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>Create At</h4>
                            <h3 className={'font-semibold'}>{format(event.createdAt, 'EEE, dd MMM yyyy HH:mm')}</h3>
                            <h4 className={'text-gray-300 font-medium text-sm'}>{format(event.createdAt, 'EEE, dd MMM yyyy HH:mm')}</h4>

                        </div>
                        <div>
                            <h4>Event Type</h4>
                            <Select className={inputCls}>
                                {eventCategories.map((category: string) => (
                                    <option key={category}>{category}</option>))}
                            </Select>
                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>Genre</h4>
                            <div className={'flex flex-wrap gap-1'}>
                                <Tag color={'processing'}>Rock</Tag>
                                <Tag color={'processing'}>hip-hop</Tag>

                            </div>
                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>End Ticket Sales</h4>
                            <div><DatePicker format={'dddd MMM DD, YYYY '} className={inputCls}/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}








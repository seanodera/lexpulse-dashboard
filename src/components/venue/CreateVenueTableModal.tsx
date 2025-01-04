import {Button, Form, Input, Modal} from "antd";
import {Venue, VenueTable} from "../../data/types.ts";
import {createVenueTableAsync} from "../../data/slices/venueSlice.ts";
import { useAppDispatch } from "../../hooks/hooks.ts";

export default function CreateVenueTableModal({isVisible, toggleModal, venue}: { isVisible: boolean, toggleModal: (value:boolean) => void, venue: Venue }) {
    const dispatch = useAppDispatch();

    const handleCancel = () => {
        toggleModal(false);
    };

    const handleOk = (values: VenueTable) => {
        console.log('Submitted values:', values);
        dispatch(createVenueTableAsync({
            venueId: venue._id,
            table: values
        }))
        toggleModal(false);
    };

    return (
            <Modal
                title="Create Venue Table"
                open={isVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form onFinish={handleOk} layout="vertical">
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: 'Please input the name!'}]}
                    >
                        <Input className={'rounded-lg'}/>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{required: true, message: 'Please input the description!'}]}
                    >
                        <Input.TextArea rows={3} className={'rounded-lg'}/>
                    </Form.Item>
                    <Form.Item
                        label="Minimum Spend"
                        name="minimumSpend"
                        rules={[{required: true, message: 'Please input the minimum spend!'}]}
                    >
                        <Input type="number" className={'rounded-lg'}/>
                    </Form.Item>
                    <Form.Item label={'available Tables'} name="available" rules={[{required: true, message: 'Please input the available tables!'}]}>
                        <Input type={'number'} defaultValue={0} className={'rounded-lg'}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Table
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

    );
}

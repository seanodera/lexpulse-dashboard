import {RecurringEvent, Venue} from "../../data/types.ts";
import {Button, Form, Input, InputNumber, Modal, Select} from "antd";

export default function CreateRecurringEventModal({isVisible, toggleModal, venue}: { isVisible: boolean, toggleModal: (value:boolean) => void, venue: Venue }) {
    const [form] = Form.useForm();

    const submitForm = (values: RecurringEvent) => {
        console.log(values);
        // TODO: Handle form submission here
        form.resetFields();
        toggleModal(false);
    };

    return (
        <Modal visible={isVisible} onCancel={() => toggleModal(false)} footer={null}>
            <Form form={form} layout="vertical" onFinish={submitForm}>
                <Form.Item
                    name="eventName"
                    label="Event Name"
                    rules={[{ required: true, message: 'Please input the event name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{required: true, message: 'Please input the event description!'}]}
                >
                    <Input.TextArea rows={4}/>
                </Form.Item>
                <Form.Item
                    name="tables"
                    label="Tables"
                    rules={[{required: true, message: 'Please select the tables!'}]}
                >
                    <Select mode="multiple" placeholder="Select tables">
                        {venue.tables ? venue.tables.map((table, index) => (
                            <Select.Option key={index} value={table.name}>
                                {table.name} - Available: {table.available}
                            </Select.Option>
                        )) : null}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="dayOfWeek"
                    label="Day of Week"
                    rules={[{ required: true, message: 'Please input the day of the week!' }]}
                >
                    <InputNumber min={0} max={6} />
                </Form.Item>

                {/* Here, you can add remaining form items for start time, end time or any other required information */}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Recurring Event
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

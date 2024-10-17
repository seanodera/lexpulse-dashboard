import { useEffect, useState } from 'react';
import { Modal, Input, Select, Form, Button } from 'antd';
import { Correspondent, getPawapayConfigs, getPaystackBanks } from "../../data/slices/payoutSlice.ts";
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';

export default function WithdrawalBankModal({ show, setShow }: { show: boolean, setShow: (value: boolean) => void }) {
    const inputCls = 'block border-solid border-gray-500 placeholder-gray-300 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
    const { loading, banks, configs } = useAppSelector(state => state.payout);
    const dispatch = useAppDispatch();

    const [currency, setCurrency] = useState('GHS');

    useEffect(() => {
        dispatch(getPaystackBanks(currency));
        dispatch(getPawapayConfigs(currency));
    }, [currency, dispatch]);

    const handleFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // Your logic to handle form submission
    };

    function mapConfigs() {
        const newConfigs: Correspondent[] = [];
        console.log(configs)
        configs.forEach(config => {
            config.correspondents.forEach(correspondent => {
                if (correspondent.operationTypes.some(value => value.operationType === 'PAYOUT')) {
                    newConfigs.push(correspondent);
                }
            });
        });
        return newConfigs;
    }

    return (
        <Modal
            open={show}
            onCancel={() => setShow(false)}
            title={<h3 className='text-lg font-semibold'>Bank Account Information</h3>}
            footer={null}
            loading={loading}
        >
            <Form
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    account_number: '',
                    bank_code: '',
                    currency: currency,
                    account_name: '',
                }}
            >
                <Form.Item
                    label="Account Name"
                    name="account_name"
                    rules={[{ required: true, message: 'Please enter your account name' }]}
                >
                    <Input placeholder="Enter your account name" className={inputCls} />
                </Form.Item>

                <Form.Item
                    label="Account Number"
                    name="account_number"
                    rules={[{ required: true, message: 'Please enter your account number' }]}
                >
                    <Input placeholder="Enter your account number" className={inputCls} />
                </Form.Item>

                <Form.Item
                    label="Bank"
                    name="bank_code"
                    rules={[{ required: true, message: 'Please choose your bank' }]}
                >
                    <Select
                        placeholder="Enter your bank"
                        className={inputCls}
                        options={
                            currency === 'GHS' ? banks.map((value) => ({
                                label: value.name,
                                value: value.id,
                            })) : mapConfigs().map(value => ({
                                label: value.correspondent,
                                value: value.correspondent,
                            }))
                        }
                    />
                </Form.Item>

                <Form.Item
                    label="Currency"
                    name="currency"
                    initialValue={currency}
                    rules={[{ required: true, message: 'Please select your currency' }]}
                >
                    <Select
                        className={inputCls}
                        defaultValue="GHS"
                        onChange={(value: string) => {
                            setCurrency(value);
                        }}
                        options={[
                            { label: 'GHS', value: 'GHS' },
                            { label: 'KES', value: 'KES' },
                            // Add more currencies as needed
                        ]}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
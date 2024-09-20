import {EventModel, Scanner} from "../../data/types.ts";
import {Field, Fieldset, Input, Label} from "@headlessui/react";
import {Button, Card} from "antd";
import {useState} from "react";

export default function ManageScanners({event}: { event: EventModel }) {
    const inputCls = 'block border-solid border-gray-500 placeholder-gray-300 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
    const [scanners, setScanners] = useState<Array<Scanner | Partial<Scanner>>>([]);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const addScanner = (e: React.FormEvent) => {
        e.preventDefault();
        const newScanner = {

            eventId: event._id,
            email,
            activated: false,
            name,
            scannedTickets: 0,
        };
        setScanners([...scanners, newScanner]);
        setName('');
        setEmail('');
    };

    const removeScanner = (index: number) => {
        const updatedScanners = scanners.filter((_, i) => i !== index);
        setScanners(updatedScanners);
    }

    return (
        <div className={'grid grid-cols-3 gap-8'}>
            <Card className={''}>
                <h2 className={'text-xl font-semibold'}>Add Scanner</h2>
                <form onSubmit={addScanner}>
                    <Fieldset className={'space-y-4'}>
                        <Field>
                            <Label className={'font-semibold '}>Name</Label>
                            <Input
                                type={'text'}
                                value={name}
                                className={inputCls}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <Label className={'font-semibold '}>Email</Label>
                            <Input
                                type={'email'}
                                value={email}
                                className={inputCls}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <Button type={'primary'} htmlType="submit">Create Scanner</Button>
                        </Field>
                    </Fieldset>
                </form>
            </Card>
            {
                scanners.map((scanner, index) => (
                    <div key={index} className={'rounded-lg shadow bg-white p-4'}>
                        <div className={'flex items-center justify-end'}>

                            <Button danger onClick={() => removeScanner(index)}>Remove</Button>
                        </div>
                        <div>
                            <div>
                                <h4 className={'text-gray-500'}>Scanner Name</h4>
                                <h3 className={'font-semibold mb-1'}>{scanner.name}</h3>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Scanner Email</h4>
                                <h3 className={'font-semibold mb-1'}>{scanner.email}</h3>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Account Activated</h4>
                                <h3 className={'font-semibold mb-1'}>{scanner.activated?.toString()}</h3>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Scanned Tickets</h4>
                                <h3 className={'font-semibold mb-1'}>{scanner.scannedTickets}</h3>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}
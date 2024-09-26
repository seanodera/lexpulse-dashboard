import {EventModel, Scanner} from "../../data/types.ts";
import {Field, Fieldset, Input, Label} from "@headlessui/react";
import {Button, Modal} from "antd";
import {SetStateAction, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks.ts";
import {createScanner, deleteScannerById, sendScannerInvite} from "../../data/slices/EventSlice.ts";

export default function ManageScanners({event}: { event: EventModel }) {
   const [scanners, setScanners] = useState<Scanner[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (event.scanners){
        setScanners(event.scanners)
        }
    }, [event]);
    


    const removeScanner = (scanner: Partial<Scanner>) => {
        
        if (scanner._id){
            dispatch(deleteScannerById(scanner._id))
        }
        const updatedScanners = scanners.filter((v) => v.email !== scanner.email);
        setScanners(updatedScanners);
    }
    console.log(scanners);
    return (
        <div>
            <div className={'flex items-center justify-end'}>
                <Button type={'primary'} ghost onClick={() => setShow(true)}>Add Scanner</Button>
            </div>
            <div className={'grid grid-cols-3 gap-8'}>
                {
                    scanners.map((scanner, index) => (
                        <div key={index} className={'rounded-lg shadow bg-white p-4'}>
                            <div className={'flex items-center justify-between'}>
                                {!scanner.activated ? <Button type={'primary'} ghost
                                                             onClick={() => dispatch(sendScannerInvite(scanner._id))}>Send
                                    Invite</Button> : <div></div>}
                                <Button danger onClick={() => removeScanner(scanner)}>Remove</Button>
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
            <AddScannerModal event={event} show={show} setShow={setShow}/>
        </div>
    );
}

function AddScannerModal({event, show, setShow,}: {
    event: EventModel, show: boolean;
    setShow: (value: SetStateAction<boolean>) => void;
}) {
    const inputCls = 'block border-solid border-gray-500 placeholder-gray-300 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
    const dispatch = useAppDispatch();

    const {scanLoading} = useAppSelector(state => state.events)
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('')
    const addScanner = (e: React.FormEvent) => {
        e.preventDefault();
        const newScanner = {

            eventId: event._id,
            email,
            activated: false,
            name,
            scannedTickets: 0,
        };
        dispatch(createScanner(newScanner));
        setName('');
        setEmail('');

    };
    return <Modal loading={scanLoading} title={'Add Scanner'} open={show}
                  onClose={() => setShow(false)}
                  footer={null}
                  onCancel={() => setShow(false)}>
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
                    <Button type={'primary'} htmlType="submit">Add Scanner</Button>
                </Field>
            </Fieldset>
        </form>
    </Modal>
}
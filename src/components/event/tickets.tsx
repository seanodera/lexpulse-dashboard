import {Button} from "antd";
import {DeleteOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {SetStateAction, useState} from "react";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {EventModel} from "../../data/types.ts";
import {Link} from "react-router-dom";



export function TicketPurchase({event}: { event: EventModel }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [amount, setAmount] = useState(1);
    const [isOpen, setIsOpen] = useState(false)
    return <div className={'flex flex-col'}>
        <h3 className={'text-primary font-semibold'}>Tickets</h3>
        <table className={'w-full border-separate border-spacing-y-2 '}>
            <thead>
            <tr>
                <td className={'font-medium text-gray-500'}>Ticket Including lexpulse fees</td>
                <td className={'font-medium text-gray-500'}>Price</td>
            </tr>
            </thead>
            <tbody className={'bg-dark'}>{event.tickets.sort((a, b) => a.price - b.price).map((ticket, index) => (
                <tr className={`py-2 ${currentIndex === index ? 'bg-primary text-white' : 'bg-white bg-opacity-10 text-white'}  hover:bg-white hover:text-dark transition-all ease-linear duration-150`}
                    key={index} onClick={() => setCurrentIndex(index)}>
                    <td className={'py-3 px-3 rounded-s-lg font-semibold'}>{ticket.name}</td>
                    <td className={'py-3 px-3 rounded-e-lg text-end'}>GHS {ticket.price}</td>
                </tr>
            ))}</tbody>
        </table>
        {event.tickets.length > 1 && <Button type={'text'} onClick={() => setIsOpen(true)} size={'small'}
                                             className={'text-sm text-gray-500 mt-2  ms-auto'}>Buying different ticket
            types?</Button>}
        {/*<h4 className={'font-medium text-gray-500 text-sm my-3'}>Ticket Sales close on {event.date.toDateString()} at {event.date.toTimeString()}</h4>*/}
        <div className={'flex justify-between mt-4'}>
            <div className={'flex gap-2 items-center mt-2'}>
                <Button disabled={amount === 0} onClick={() => setAmount((prev) => prev - 1)} type={'primary'}
                        size={'large'} ghost shape={'circle'}
                        icon={<MinusOutlined/>}/>
                <h1 className={'my-0 text-3xl'}>{amount}</h1>
                <Button onClick={() => setAmount((prev) => prev + 1)} type={'primary'} size={'large'} ghost
                        shape={'circle'}
                        icon={<PlusOutlined/>}/>
            </div>
            <div className={'flex justify-end items-center gap-2'}>
                <h2 className={'my-0'}>GHS {(event.tickets[ currentIndex ].price * amount).toFixed(2)}</h2>
                <Link to={'/checkout'} ><Button disabled={amount === 0} type={'primary'} size={'large'}>Buy
                    Tickets</Button></Link>
            </div>
        </div>
        <TicketPurchaseDialog event={event} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
}


export function TicketPurchaseDialog({event, isOpen, setIsOpen}: {
    event: EventModel,
    isOpen: boolean,
    setIsOpen: (value: SetStateAction<boolean>) => void
}) {
    const [cart, setCart] = useState<{
        id: string,
        name: string,
        amount: number;
        price: number;
    }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [amount, setAmount] = useState(1);

    const addToCart = () => {
        const selectedTicket = event.tickets[ currentIndex ];
        const existingCartItem = cart.find(item => item.id === selectedTicket.id);

        if (existingCartItem) {
            // Update quantity and price if ticket already in cart
            setCart(cart.map(item =>
                item.id === selectedTicket.id
                    ? {...item, amount: item.amount + amount, price: item.price + selectedTicket.price * amount}
                    : item
            ));
        } else {
            // Add new ticket to the cart
            setCart([...cart, {
                id: selectedTicket.id,
                name: selectedTicket.name,
                amount: amount,
                price: selectedTicket.price * amount
            }]);
        }
        setAmount(1); // Reset amount after adding to cart
    };

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.amount, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-dark bg-opacity-60">
                <DialogPanel
                    className="max-w-3xl w-full min-h-80 border bg-white overflow-hidden grid grid-cols-5  rounded-lg">
                    <div className={'col-span-3 p-4'}>
                        <DialogTitle className="font-bold">Review Tickets</DialogTitle>
                        <table className={'w-full border-separate border-spacing-y-2'}>
                            <thead>
                            <tr>
                                <td className={'py-3 px-3 font-semibold text-gray-500'}>Ticket Options</td>
                                <td className={'py-3 px-3 font-semibold text-gray-500'}>Price</td>
                            </tr>
                            </thead>
                            <tbody>
                            {event.tickets.sort((a, b) => a.price - b.price).map((ticket, index) => (
                                <tr className={`py-2 ${currentIndex === index ? 'bg-primary text-white' : 'bg-dark bg-opacity-85 text-white'} rounded-xl  hover:bg-white hover:text-dark transition-all ease-linear duration-150`}
                                    key={index} onClick={() => setCurrentIndex(index)}>
                                    <td className={'py-3 px-3 rounded-s-lg font-semibold'}>{ticket.name}</td>
                                    <td className={'py-3 px-3 rounded-e-lg text-end'}>GHS {ticket.price}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={'col-span-2 bg-dark text-white flex flex-col p-4'}>
                        <h3 className={'font-semibold'}>Cart</h3>
                        {cart.length > 0 ? cart.map((cartItem, index) => (
                            <div key={index}
                                 className={'flex justify-between items-center w-full border-b border-gray-500 pb-2 mb-2'}>
                                <div className={'group w-full'}>
                                    <h4>{cartItem.name}</h4>
                                    <div className={'flex justify-between w-full'}>
                                        <h4 className={'text-sm'}>Qty: {cartItem.amount}</h4>
                                        <h4 className={'text-primary'}>GHS {cartItem.price.toFixed(2)}</h4>
                                    </div>
                                </div>
                                <Button onClick={() => removeFromCart(index)} size={'small'} type={'text'} danger
                                        shape={'circle'} icon={<DeleteOutlined/>}/>
                            </div>
                        )) : (
                            <p>Your cart is empty.</p>
                        )}
                        <div className={'mt-4'}>
                            <h4>Total Tickets: {totalAmount}</h4>
                            <h4>Total Price: GHS {totalPrice.toFixed(2)}</h4>
                        </div>
                    </div>
                    <div className={'col-span-3 flex justify-between items-center gap-2 p-4'}>
                        <div className={'flex gap-2 items-center mt-2'}>
                            <Button disabled={amount === 0} onClick={() => setAmount((prev) => Math.max(1, prev - 1))}
                                    type={'primary'} ghost shape={'circle'} icon={<MinusOutlined/>}/>
                            <h1 className={'my-0 text-xl'}>{amount}</h1>
                            <Button onClick={() => setAmount((prev) => prev + 1)} type={'primary'} ghost
                                    shape={'circle'} icon={<PlusOutlined/>}/>
                        </div>
                        <Button onClick={addToCart} disabled={amount === 0} type={'primary'}>Add To Cart</Button>
                    </div>
                    <div className={' col-span-2 bg-dark flex items-center justify-end gap-2 p-4'}>
                        <Button onClick={() => setIsOpen(false)} type={'primary'} danger ghost>Close</Button>
                        <Button type={'primary'}>Check Out</Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
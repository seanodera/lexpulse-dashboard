import {Button, Card} from 'antd';
import {useAppSelector} from "../../hooks/hooks.ts";
import {selectCurrentUser} from "../../data/slices/authSlice.ts";
import {useState} from "react";
import WithdrawalBankModal from "./withdrawalAccountModal.tsx";
import {useAppContext} from "../../shells/ContextProvider.tsx";


const WithdrawBankAccountForm = () => {
    const user = useAppSelector(selectCurrentUser)
    const [show, setShow] = useState<boolean>(false);
    const context = useAppContext();
    return (
        <>
            {(!user?.withdrawalAccounts || user?.withdrawalAccounts.length === 0) ?
                <Button type={'primary'} block size={'large'} onClick={() => context?.setShowWithdrawalModal(true)}>Add Withdrawal
                    Account</Button>
                : <Card>
                    <Button className={'my-3'} type={'primary'} block size={'large'} onClick={() => context?.setShowManageWithdrawalAccountModal(true)}>Manage Accounts</Button>
                    <Button className={'my-3'} type={'primary'} block size={'large'} onClick={() => context?.setShowWithdrawalModal(true)}>Create Withdrawal</Button>

                </Card>}
            <WithdrawalBankModal show={show} setShow={setShow}/>

        </>
    );
};



export default WithdrawBankAccountForm;
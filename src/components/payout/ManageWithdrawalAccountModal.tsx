import {useAppDispatch, useAppSelector} from "../../hooks/hooks.ts";
import {fetchUserWithdrawalAccounts, selectCurrentUser} from "../../data/slices/authSlice.ts";
import {useEffect} from "react";
import {Button, Modal} from "antd";
import {EllipsisOutlined} from "@ant-design/icons";

export default function ManageWithdrawalAccountModal({show, setShow}: {
    show: boolean,
    setShow: (value: boolean) => void
}) {
    const user = useAppSelector(selectCurrentUser)
    const accounts = useAppSelector(state => state.auth.accounts);
    const dispatch = useAppDispatch();
    useEffect(() => {
        console.log(user,user?.withdrawalAccounts.length ,accounts.length,accounts)
        if (show && user && user.withdrawalAccounts.length !== accounts.length) {
            dispatch(fetchUserWithdrawalAccounts(user.id))
        }
    }, [user,show]);

    return <Modal open={show} onCancel={() => setShow(false)}
                  onClose={() => {
                      setShow(false)
                  }} footer={null}>
        <div className={'flex'}>
            <div className={'space-y-4'}>
                {accounts.map((account, index) => (
                    <div key={index} className={'rounded-lg p-3 border shadow flex justify-between'}>
                        <div>
                            <h3 className={'font-medium'}>{account.bank_name}</h3>
                            <h4>{account.accountNumber}</h4>
                            <h4>{account.name}</h4>
                        </div>
                        <div>
                            <Button icon={<EllipsisOutlined/>} type={'text'}/>
                            <h4>{account.currency}</h4>
                        </div>
                    </div>))}
            </div>
        </div>
    </Modal>
}

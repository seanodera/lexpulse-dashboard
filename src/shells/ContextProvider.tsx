import { ReactNode, useState, createContext, useContext } from "react";
import ManageWithdrawalAccountModal from "../components/payout/ManageWithdrawalAccountModal.tsx";
import WithdrawalBankModal from "../components/payout/withdrawalAccountModal.tsx";
import {ConfigProvider} from "antd";
import {darkColors, primaryColor} from "../../colors.ts";


interface ModalContextProps {
    showWithdrawalModal: boolean;
    setShowWithdrawalModal: (show: boolean) => void;
    showManageWithdrawalAccountModal: boolean;
    setShowManageWithdrawalAccountModal: (show: boolean) => void;
}


const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export default function ContextProvider({ children }: { children: ReactNode }) {
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [showManageWithdrawalAccountModal, setShowManageWithdrawalAccountModal] = useState(false);
    const [isDarkMode] = useState<boolean>(false);


    const lightTheme = {
        token: {
            colorPrimary: primaryColor['500'],
            colorTextBase: '#000000',
            colorBgBase: '#ffffff',
            colorInfo: primaryColor['500'],
        },
        components: {
            Layout: {
                siderBg: darkColors.dark,
            },
            Menu: {
                darkItemBg: darkColors.dark,
            },
            Select: {
                clearBg: "rgba(255,255,255,0)",
                selectorBg: "rgba(255,255,255,0)",
            },
        },
    };

    const darkTheme = {
        token: {
            colorPrimary: primaryColor['700'],
            colorTextBase: '#E4E4E4',
            colorBgBase: darkColors.dark,
            colorBgContainer: '#1F1F1F',
            colorInfo: primaryColor['500'],
        },
        components: {
            Layout: {
                siderBg: darkColors.dark,
            },
        },
    };

    return (
        <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <ModalContext.Provider value={{
            showWithdrawalModal,
            setShowWithdrawalModal,
            showManageWithdrawalAccountModal,
            setShowManageWithdrawalAccountModal
        }}>
            <WithdrawalBankModal show={showWithdrawalModal} setShow={setShowWithdrawalModal} />
            <ManageWithdrawalAccountModal show={showManageWithdrawalAccountModal} setShow={setShowManageWithdrawalAccountModal} />

            {children}
        </ModalContext.Provider>
        </ConfigProvider>
    );
};


export function useAppContext(){
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useModalContext must be used within a ContextProvider");
    }
    return context;
};
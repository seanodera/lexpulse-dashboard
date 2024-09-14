
import {Breadcrumb} from 'antd';
import React, {useEffect} from 'react';
import {Link, useLocation} from "react-router-dom";
import {useAppSelector} from "../../hooks/hooks.ts";
import {selectFocusEvent} from "../../data/slices/EventSlice.ts";
import {RightOutlined} from "@ant-design/icons";


const Breadcrumbs: React.FC = () => {
    const pathname = useLocation().pathname;
    const currentEvent = useAppSelector(selectFocusEvent);
    const [currentPath, setCurrentPath] = React.useState('Dashboard');
    const pathSnippets = pathname.split('/').filter(i => i);


    const breadcrumbItems = pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        let path = snippet;

        if (index > 0) {
            const prevSnippet = pathSnippets[ index - 1 ];
            if (prevSnippet === 'manage-events' && snippet !== 'create') {
                if (currentEvent){
                    path = currentEvent.eventName
                }
            }
        }

        return {
            key: url,
            title: <Link className={'text-white'} to={url}>{path}</Link>,
        };
    });

    const items = [
        {
            key: 'home',
            title: <Link className={'text-white'} to="/">Dashboard</Link>,
        },
        ...breadcrumbItems,
    ];
    useEffect(() => {
        console.log(pathSnippets.length);
        if (pathSnippets.length > 1) {

            const snippet = pathSnippets[pathSnippets.length - 1];
            let path = snippet;

                const prevSnippet = pathSnippets[ pathSnippets.length - 2 ];
            if (prevSnippet === 'manage-events' && snippet !== 'create') {
                if (currentEvent){
                    path = currentEvent.eventName
                }
            }
            setCurrentPath(path);
        } else if (pathSnippets.length === 1){
            setCurrentPath(pathSnippets[0])
        } else {
            if (pathname === '/') {
                setCurrentPath('Dashboard');
            } else {
                setCurrentPath(pathname);
            }
        }

    }, [pathname]);

    return (
        <div>
            <h2 className={'text-white text-xl font-semibold mb-0 capitalize'}>{currentPath}</h2>
            <Breadcrumb className="items-center text-white" separator={<RightOutlined className={'text-primary'}/>} items={items}/>
        </div>
    );
};

export default Breadcrumbs;

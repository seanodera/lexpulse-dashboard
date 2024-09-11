import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./screens/home.tsx";
import MainShell from "./shells/mainShell.tsx";
import {ConfigProvider} from "antd";
import {useState} from "react";
import {darkColors, primaryColor} from "../colors.ts";
import CreateEventScreen from "./screens/createEvent.tsx";
import ManageEvent from "./screens/manageEvent.tsx";
import SingleEventScreen from "./screens/singleEvent.tsx";

function App() {

    const [isDarkMode] = useState(false);

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
            }
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
                siderBg: darkColors.dark
            }
        },
    };

    return (
   <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
       <BrowserRouter>
           <Routes>
               <Route element={<MainShell/>}>
                   <Route path={'/'} element={<Home/>}/>
                   <Route path={'/create-event'} element={<CreateEventScreen/>}/>
                   <Route path={'/manage-events'} element={<ManageEvent/>}/>
                   <Route path={'/manage-events/:id'} element={<SingleEventScreen/>}/>
               </Route>
           </Routes>
       </BrowserRouter>
   </ConfigProvider>
  )
}

export default App

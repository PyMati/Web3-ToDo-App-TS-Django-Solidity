import React, { useEffect } from "react";
import { useState } from "react";
import { TasksPage } from "./sites/TasksPage";
import { LoginPage } from "./sites/LoginPage";
import { Smartcontract_ABI } from "./abi";
import * as ethers from 'ethers';


export const App: React.FC = () => {
    const [userAddress, setUserAddress] = useState("");
    const [is_connected, setConnection] = useState(false);
    const [tasksList, setTasksList] = useState([]);
    const [smartContract, setSmartContract] = useState<ethers.Contract | undefined>();

    return(
        <>
            { is_connected ? <TasksPage taskList = { tasksList } taskHandler = { setTasksList } wallet = { userAddress } smrtContract={smartContract}/> : 
            <LoginPage setter = { setUserAddress } 
            connectionsetter = { setConnection }
            taskList = { tasksList } 
            taskHandler = { setTasksList } 
            smartContractSetter = { setSmartContract }
            smrtContract={smartContract}/>}
        </>
    );
};
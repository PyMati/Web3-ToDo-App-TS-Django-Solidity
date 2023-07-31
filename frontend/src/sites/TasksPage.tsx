import React from "react";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/taskpage.css';
import { Card } from "../components/Card";
import { Task } from "../intsandtypes/Task";
import * as ethers from 'ethers';

interface User {
    wallet: string,
}

interface TaskInt extends User{
    taskList: Task[],
    taskHandler: (newTaskList: any) => void,
    smrtContract: ethers.Contract | undefined,
};

export const TasksPage: React.FC<TaskInt> = props => {
    const titleGetter = useRef<HTMLInputElement>(null);
    const descriptionGetter = useRef<HTMLTextAreaElement>(null);
    const [reward, setReward] = useState("0");
    const isMounted = useRef(false);
    const [userLevel, setLevel] = useState(0);
    const [userLevelCost, setLevelCost] = useState(0);
    const [userBalance, setBalance] = useState(0);

    useEffect(() => {
        const getSmartContractData = async () => {
            let lvl = Number(await props.smrtContract!.getCurrentLevel());
            let balance = Number(await props.smrtContract!.balanceOf(props.wallet));
            let cost = Number(await props.smrtContract!.getCurrentLevelUpPrice());
            setLevel(lvl);
            setBalance(balance);
            setLevelCost(cost);
        }
        getSmartContractData();
    }, [props.taskList]);

    useEffect(() => {
        
        if(!isMounted.current) {
            isMounted.current = true
            return;
        }
        console.log("Saving...")
        
        axios.post("http://127.0.0.1:8000/api",{ data: [props.taskList, props.wallet]});

    }, [props.taskList]);

    const AddToFinished = (title: string) => {
        const finishedTask = props.taskList.filter(todo => todo.title === title)[0];
        finishedTask.done = true;
        const restOfTodos = props.taskList.filter(todo => todo.title !== title);
        props.taskHandler([...restOfTodos, finishedTask]);
    };

    const DeleteTaskFromDatabaseHandler = (title: string) => {
        const restOfTodos = props.taskList.filter(todo => todo.title !== title);
        props.taskHandler([...restOfTodos]);
    };

    const ClearForm = () => {
        titleGetter.current!.value = "";
        descriptionGetter.current!.value = "";
    };

    const CheckInputError = () => {
        if(titleGetter.current!.value.length < 3){
            alert("Title of new task is too short");
            return true;
        }
        else if(descriptionGetter.current!.value.length < 5) {
            alert("Description of new task is too short")
            return true;
        };
        return false;
    };

    const RewardHandler = () => {
        const title_points = titleGetter.current!.value as string ;
        const description_points = descriptionGetter.current!.value as string;
        const new_reward = ((title_points.length / 5) + (description_points.length / 2.5)) / 10;
        const fixed_reward = new_reward.toPrecision(2);
        setReward(fixed_reward);
    };

    const AddTaskHandler = (event: React.FormEvent) => {
        event.preventDefault();
        if(!CheckInputError()){
            const taskToAdd: Task = {
                done: false,
                title: titleGetter.current!.value,
                description: descriptionGetter.current!.value,
                reward: reward,
            };
            props.taskHandler([...props.taskList, taskToAdd]);
            ClearForm();
        }
    };

    const refreshData = async () => {
        let lvl = Number(await props.smrtContract!.getCurrentLevel());
        let balance = Number(await props.smrtContract!.balanceOf(props.wallet));
        let cost = Number(await props.smrtContract!.getCurrentLevelUpPrice());
        setLevel(lvl);
        setBalance(balance);
        setLevelCost(cost);
    };

    const LevelUp = async () => {
        await props.smrtContract!.levelUpAccount()
    }

    return(
        <>
            <div className="container-fluid main-container">
                <div className="row">
                    <div className="column">
                        <header>User data</header>
                        <div id="home">
                            <h6>Connected wallet: { props.wallet} </h6>
                            <h6>Level: { userLevel } </h6>
                            <h6>Level up price: { userLevelCost } </h6>
                            <h6>Current balance: { userBalance } </h6>
                            <button onClick={ LevelUp } className="btn-padding btn btn-dark">Level up</button>
                            <button onClick={ refreshData } className="btn-padding btn btn-dark">Refresh</button>
                        </div>


                        <header>Add new task</header>
                        <div className="container-fluid form-container">
                            <form onSubmit = { AddTaskHandler } onChange={ RewardHandler }>
                                <div className="row">
                                        <label>Title</label>
                                        <input type="text" ref = { titleGetter } id="title-input" maxLength={15}></input>
                                </div>
                                <div className="row">
                                    <label>Description</label>
                                    <textarea ref = {descriptionGetter} cols={30} rows={10} className="textareares"></textarea>
                                </div>
                                <input type="submit" value = "Add" className="btn-padding btn btn-dark"></input>
                            </form>
                            <p>Estimated Reward: { reward }</p>
                        </div>

                        <header>Undone tasks</header>
                        <div id="undone" className="taskcontainer">
                            <div className="container-fluid">
                                <div className="row">
                                    { props.taskList.filter(todo => todo.done === false).map(tds => (
                                        <Card title = { tds.title } 
                                        reward = {tds.reward} 
                                        done = { tds.done } 
                                        description = { tds.description } 
                                        addToEnd = { AddToFinished } 
                                        deleteFromDB={ DeleteTaskFromDatabaseHandler }
                                        smrtContract = { props.smrtContract }></Card>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <header>Done tasks</header>
                        <div id="done">
                            <div className="container-fluid">
                                <div className="row">
                                {props.taskList.filter(todo => todo.done === true).map(tds => (
                                        <Card title = { tds.title }
                                         reward = {tds.reward} 
                                         done = { tds.done } 
                                         description = { tds.description } 
                                         addToEnd = { AddToFinished } 
                                         deleteFromDB={ DeleteTaskFromDatabaseHandler }
                                         smrtContract = { props.smrtContract }></Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
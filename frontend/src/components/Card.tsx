import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/taskpage.css';
import * as ethers from 'ethers';

interface TaskData {
    done: boolean,
    title: string,
    description: string,
    reward: string,
    addToEnd: (title: string) => void,
    deleteFromDB: (title: string) => void,
    smrtContract: ethers.Contract | undefined
}

export const Card: React.FC<TaskData> = props => {

    const GetReward = () => {

    }

    const DeleteTaskHandler = () => {
        props.addToEnd(props.title);
    };

    const DeleteFromDB = async () => {
        let reward_to_obtain = parseFloat(props.reward);
        props.smrtContract!.getReward(reward_to_obtain.toFixed(0));
        props.deleteFromDB(props.title);
    };

    return(
        <>
        <div className="card col-md-3">
            <div className="card-body">
                <h5 className="card-title">{ props.title }</h5>
                { props.done === false ? <h6 className="card-subtitle mb-2 text-muted">Estimated Reward: { props.reward }</h6> : <h6 className="card-subtitle mb-2 text-muted">Reward: { props.reward }</h6> }
                <p className="card-text">{ props.description }</p>
                { props.done === false ? <button onClick={ DeleteTaskHandler } className="btn-padding btn btn-dark">End</button> : <button onClick={ DeleteFromDB } className="btn-padding btn btn-dark">Get Reward</button> }
            </div>
        </div>
        </>
    );
};
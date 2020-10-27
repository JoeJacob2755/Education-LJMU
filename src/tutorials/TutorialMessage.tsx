import { IconButton, Typography } from "@material-ui/core";
import { Close, ExitToApp } from "@material-ui/icons";
import parseRst from "../providers/parseRST"
import React from "react";

interface TutorialMessageProps {
    target: Element | string | null;
    title: string;
    message: string;
    isCompleted: () => boolean;
    onCompleted: (boolean?) => void | any;
    progress: number
}

export const TutorialMessage:React.FC<TutorialMessageProps> = (props) => {

    

    const [x, setX] = React.useState(300);
    const [y, setY] = React.useState(300);

    let isDone = false;

    const timeoutFun = () => {

        if(props.isCompleted()) {
            props.onCompleted(true);
        } else {
            let target = props.target
            if (typeof(target) === "string") {
                target = document.querySelector(target)
            }
            
            if (target) {
                const rect = target.getBoundingClientRect()
                const _x = rect.x + rect.width
                const _y = rect.y + 15
               if (_x !== x) {
                   setX(_x)
               }
               if(_y !== y) {
                   setY(_y)
               }
            }
            
            setTimeout(timeoutFun, 50)
        }
    }

    
    React.useEffect(() => {timeoutFun()}, [])


    return (
        <div className="tutorial-message-root" style={{left:x, top: y - 30}}>
            <div className="tutorial-message-header">
                <div className="tutorial-message-title">
                    <Typography variant="h5">{props.title}</Typography>
                </div>
                <div className="tutorial-message-button tutorial-message-cross">
                    <IconButton onClick={() => {
                        props.onCompleted(false)
                    }}><Close color="error"></Close></IconButton>
                </div>
            </div>
            <div className="tutorial-message-body" dangerouslySetInnerHTML={{__html: parseRst(props.message)}}></div>
            <div className="tutorial-message-progress" style={{transform: `scaleX(${props.progress})`}}></div>
        </div>
    )
}
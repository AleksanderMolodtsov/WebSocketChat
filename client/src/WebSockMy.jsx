import React, {useState, useRef} from "react";

const WebSockMy = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef();
    const [connected, setConnected] = useState(false);
    const [userName, setUserName] = useState('');
    const mesRef = useRef();

    const sound = document.getElementById('messageSound');

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000');
        socket.current.onopen = () => {
            console.log(`Opened userName: ${userName}`)
            setConnected(true);
            const message = {
                event: 'connection',
                userName,
                id: Date.now(),
            }
            socket.current.send(JSON.stringify(message));
        }
        socket.current.onmessage = (event) => {
            console.log('Message')
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Closed')
            setConnected(false);
        }
        socket.current.onerror = () => {
            console.log('Error')
        }
    }

    const sendMessage = async () => {
        const time = new Date();
        const message = {
            userName,
            message: value,
            id: Date.now(),
            event: 'message',
            time: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        }
        socket.current.send(JSON.stringify(message));
        setValue('')
        await sound.play();
        mesRef.current.focus();
    }

    const submitHandler = (e, handlerFunc) => {
        e.preventDefault();
        handlerFunc();
    }

    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <form onSubmit={e => submitHandler(e, connect)}>
                        <input
                            type="text"
                            placeholder="Видеите ваше имя!"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}/>
                    </form>

                    <button onClick={connect}>"Войти"</button>
                </div>
            </div>
        )
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <form onSubmit={e => submitHandler(e, sendMessage)}>
                        <input ref={mesRef} value={value} onChange={e => setValue(e.target.value)} type="text"/>
                    </form>
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">
                                    Пользователь "{mess.userName}" подключился
                                </div>
                                : <div className="message">
                                    {mess.time} <b>{mess.userName}:</b> {mess.message}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WebSockMy;
import { useState, useEffect } from 'react';
import './App.css';
import CountSection from './components/CountSection';
import ArrayCopy from './components/ArrayCopy';
import Choices from './components/Choices';

interface Choice {
    label: string;
    enabled: boolean;
}

function App() {
    
    const [choices, setChoices] = useState<Choice[]>(Array(12).fill({ label: '', enabled: false }));
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

    // const ws = new WebSocket("ws://localhost:8080?role=admin");
    // let ws;

    useEffect(() => {
        // const serverAddress = "ws://192.168.1.67:8080?role=admin"; // WebSocket URL with role

        console.log("old cookie is : ", document.cookie)
        console.log("App component rendered");
        
        const serverAddress = "wss://peterzhong.ca:2096?role=admin"
        const socket = new WebSocket(serverAddress);
        let userID = getCookie("userID");

        socket.onopen = () => {
            console.log("WebSocket connected.");
            keepAlive();
        };

        // socket.onmessage = (event) => {
        //     const data = JSON.parse(event.data);
        //     console.log("Received from WebSocket:", data);

        //     if (data.type === "login_success") {
        //         setIsLoggedIn(true); // Set logged in status
        //     } else if (data.type === "login_error") {
        //         alert("Login failed!");
        //         socket.close();
        //     }
        // };

        socket.onmessage = (event) => {
            let msg = JSON.parse(event.data);

            // If userID is received from server, store and display it
            if (msg.system && msg.userID) {
                userID = msg.userID;
                setCookie("userID", userID || "defaultUserID", 30);
                // document.getElementById("user-id").textContent = "Your User ID: " + userID;
            } 
            
            if (msg.type === "pong") {
                console.log("Received pong from server.");
            } else {
                console.log(msg)
                if (msg.type == 'update_choices'){
                    setChoices(msg.choices)
                    console.log('choice set')
                }
                // addMessage(msg);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed.");
            reconnect(); // Try to reconnect
            setIsLoggedIn(false);
        };

        setWs(socket);

        // Clean up on component unmount
        return () => {
            if (socket) {
                socket.close();
            }
        };

        function keepAlive() {
            setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: "ping" }));
                    console.log("Sent ping to server.");
                }
            }, 30000); // Send ping every 30 seconds
        }
    
        function reconnect() {
            setTimeout(() => {
                console.log("Reconnecting WebSocket...");
                setWs(new WebSocket(serverAddress)); // Recreate the connection
            }, 5000); // Try reconnecting after 5 seconds
        }
    }, []);

    // Send clear database request to WebSocket server
    // const clearDatabase = () => {
    //     if (ws) {
    //         ws.send(JSON.stringify({ type: 'clear_database' }));
    //     }
    // };

    // Send updated choices to WebSocket server
    const updateChoices = () => {
        if (ws) {
            ws.send(JSON.stringify({ type: 'update_choices', choices: choices }));
        }
    };

    const sendResults = () =>{
        if (ws){
            ws.send(JSON.stringify({ type: 'send_results' }));
        }
    }

    // Send alert to all users
    const alertUsers = (message: string) => {
        if (ws) {
            ws.send(JSON.stringify({ type: 'alert', message: message }));
        }
    };

    function setCookie(name: string, value: string, days: number) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
    
        // Set the cookie with SameSite=None and Secure attributes
        document.cookie = name + "=" + value + "; path=/" + expires + "; SameSite=None; Secure";
    }

    function getCookie(name : string) {//name is just 'userID', the field of cookie storing the userID
        console.log("document.cookie:", document.cookie); // Log the cookies string

        // let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        
        // console.log("Regex match result for", name, ":", match); // Log the match result

        // console.log("match [2] is :",match[2])

        getUserID();
        let cookies = document.cookie.split("; ").find(row => row.startsWith(name));
        return cookies ? cookies.split("=")[1] : null
        
        // return match ? match[2] : null;
    }

    function getUserID() {
        let cookies = document.cookie.split("; ").find(row => row.startsWith("userID="));
        console.log( "new approach: ",cookies ? cookies.split("=")[1] : null);
    }

    

    // const ws = new WebSocket("ws://localhost:8080?role=admin");
    // const serverAddress = "ws://192.168.1.67:8080?role=admin"; // Change if needed
    // ws = new WebSocket(serverAddress);

    // const updateChoices = () => {
    //     ws.send(JSON.stringify({ type: "update_choices" }));
    // };

    // const fetchChoices = async () => {
    //     try {
    //         const response = await fetch("http://localhost/vote-app/backend/get_choices.php");
    //         const data = await response.json();

    //         if (Array.isArray(data.choices)) {
    //             setChoices(data.choices);
    //         } else {
    //             console.error("Invalid data format received:", data);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching choices:", error);
    //     }
    // };

    // Load choices when the component mounts
    // useEffect(() => {
    //     fetchChoices();
    // }, []);

    // const clearTable = async () => {
    //     const response = await fetch("http://localhost/vote-app/backend/clear_choices.php", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     });

    //     const result = await response.json();
    //     console.log(result);
    //     return result.success;
    // };

    // // Handle updates
    //  const updateChoices = async () => {
    //     const cleared = await clearTable(); // Clear the table first

    //     if (!cleared) {
    //         alert("Error clearing the table");
    //         return;
    //     }

    //     // Insert each choice after clearing the table
    //     // Send all choices in a single request
    //     const response = await fetch("http://localhost/vote-app/backend/insert_choice.php", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             choices: choices, // Send the whole array at once
    //         }),
    //     });

    //     const result = await response.json();
    //     console.log(result);
    // };

    return (
        
        <div className="container">
            <h2>Manage Voting Choices</h2>
            {choices.map((choice, index) => (
                <div key={index} className="choice-container">
                    <input
                        type="text"
                        value={choice.label}
                        onChange={(e) => {
                            const newChoices = [...choices];
                            newChoices[index] = { ...newChoices[index], label: e.target.value };
                            setChoices(newChoices);
                        }}
                        placeholder={`Choice ${index + 1}`}
                        className="text-input"
                    />
                    <input
                        type="checkbox"
                        checked={choice.enabled}
                        onChange={() => {
                            const newChoices = [...choices];
                            newChoices[index] = { ...newChoices[index], enabled: !newChoices[index].enabled };
                            setChoices(newChoices);
                        }}
                        className="checkbox"
                    />
                </div>
            ))}
            {/* <button onClick={clearDatabase} className="update-button">
            Clear Database
            </button> */}
            <button onClick={sendResults} className="update-button">
            Send Results
            </button>
            <button onClick={updateChoices} className="update-button">
                Update Choices
            </button>
            <button onClick={() => alertUsers("start voting!")} className="alert-button">
                Vote!
            </button>

        </div>
    );
}

export default App;

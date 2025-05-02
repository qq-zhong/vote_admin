import { useState } from "react";
import "./LoginContainer.css"; // Import the CSS file

interface LoginContainerProps {
    reconnectWebSocket: (password: string) => void;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ reconnectWebSocket }) => {
    const [password, setPassword] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleReconnect = () => {
        if (!password) {
            document.getElementById("server_reply")!.textContent = "Please enter a password.";
            return;
        }
        reconnectWebSocket(password);
    };

    return (
        <div className="role-container">
            <p>Super user password:</p>
            <input
                className="text-input"
                type="password"
                value={password}
                onChange={handleChange}
            />
            <button onClick={handleReconnect}>Reconnect with New Role</button>
            <p id="server_reply"></p>
        </div>
    );
};

export default LoginContainer;

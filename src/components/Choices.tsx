import { useState } from "react";

function Choices() {
    const [choices, setChoices] = useState([
        { label: "Option 1", enabled: false },
        { label: "Option 2", enabled: true },
    ]);

    const toggleFirstChoice = () => {
        const newChoices = [...choices]; // Copy the array
        newChoices[0] = { ...newChoices[0], enabled: !newChoices[0].enabled }; // Copy object & toggle enabled
        setChoices(newChoices); // Update the state
    };

    return (
        <div className="section">
            <h3>Choices Example</h3>
            <p>First Choice: {choices[0].label} - {choices[0].enabled ? "Enabled" : "Disabled"}</p>
            <button onClick={toggleFirstChoice}>Toggle First Choice</button>
        </div>
    );
}

export default Choices;

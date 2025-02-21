import { useState } from "react";

function ArrayCopy() {
    const [numbers, setNumbers] = useState([1, 2, 3]);

    const updateNumbers = () => {
        const newNumbers = [...numbers]; // Creates a shallow copy
        newNumbers[1] = 99; // Modify second element
        setNumbers(newNumbers); // Update the state
    };

    return (
        <div className="section">
            <h3>Array Shallow Copy Example</h3>
            <p>Numbers: {numbers.join(", ")}</p>
            <button onClick={updateNumbers}>Change Second Number</button>
        </div>
    );
}

export default ArrayCopy;

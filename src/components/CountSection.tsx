import { useState } from "react";

function CountSection() {
    const [count, setCount] = useState(0);

    return (
        <div className="section">
            <h3>Count Example</h3>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increase</button>
        </div>
    );
}

export default CountSection;

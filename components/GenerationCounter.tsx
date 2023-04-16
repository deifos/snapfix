import { useEffect, useState } from 'react';



function GenerationsCounter() {
    const [generations, setGenerations] = useState(0);

    const fetchData = async () => {
        const response = await fetch('/api/generations');
        const data = await response.json();
        setGenerations(data);
    }

    useEffect(() => {

        fetchData();
    }, []);

    return (
        <div>
            <h1>Generations</h1>
            <ul>
                {generations}
            </ul>
        </div>
    );
}


export default GenerationsCounter
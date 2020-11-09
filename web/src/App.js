import React, { useState, useEffect } from 'react';
import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import api from './services/api';
import DevCard from './components/DevCard';
import DevForm from './components/DevForm';

function App() {

    const [devs, setDevs] = useState([]);
    const [reversedDevs, setReversedDevs] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await api.get('/devs');
            setDevs(response.data);
        })();
    }, []);

    useEffect(() => {
        setReversedDevs([...devs].reverse());
    }, [devs]);

    async function apiPostDev(dev) {
        try {
            const response = await api.post('/devs', dev);
            setDevs([...devs, response.data]);
        } catch (err) {
            const errMsg = `Ops! Falha na requisição: ${err.message}`;
            alert(errMsg);
            throw new Error(errMsg);
        }
    }

    return (
        <div id="app">

            <aside>
                <strong>Cadastrar</strong>
                <DevForm onSubmit={apiPostDev} />
            </aside>

            <main>
                <ul>{reversedDevs.map( item => <DevCard key={item._id} dev={item}/> )}</ul>
            </main>

        </div>
    );
}

export default App;
import React, {useState, useEffect} from 'react';
import './styles.css';

function DevForm( {onSubmit} ) {

    const [github, setGithub] = useState('');
    const [techs, setTechs] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
            },
            (err) => {
                console.log(err);
            },
            {
                timeout: 30000
            }
        )
    }, []);

    async function handleSubmit(e) {

        e.preventDefault();
        const dev = { github, techs, latitude, longitude }

        try {
            await onSubmit(dev);
            setGithub('');
            setTechs('');
            alert('Dev adicionado com sucesso!');
        } catch (err) {
            console.log(err);
        }
        
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-block">
                <label htmlFor="github">Usuário do GitHub</label>
                <input
                    name="github"
                    id="github"
                    value={github}
                    onChange={ e => setGithub(e.target.value) }
                    required
                />
            </div>

            <div className="input-block">
                <label htmlFor="Tecnologias">Tecnologias</label>
                <input
                    name="Tecnologias"
                    id="Tecnologias"
                    value={techs}
                    onChange={ e => setTechs(e.target.value) }
                    required
                />
            </div>

            <div className="input-group">
                <div className="input-block">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                        type="number"
                        name="latitude"
                        id="latitude"
                        value={latitude}
                        onChange={ e => setLatitude(e.target.value) }
                        required
                    />
                </div>

                <div className="input-block">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                        type="number"
                        name="longitude"
                        id="longitude"
                        value={longitude}
                        onChange={ e => setLongitude(e.target.value) }
                        required
                    />
                </div>
            </div>

            <button type="submit">Salvar</button>
        </form>
    );
}

export default DevForm;
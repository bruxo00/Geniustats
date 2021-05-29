import React, { useEffect, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { useHistory, useLocation } from 'react-router';

const Home = () => {
    const history = useHistory();
    const [artist, setArtist] = useState('');
    const [song, setSong] = useState('');

    const onArtistChange = (event) => {
        setArtist(event.target.value);
    }

    const onSongChange = (event) => {
        setSong(event.target.value);
    }

    const onButtonClick = () => {
        history.push({
            pathname: '/stats',
            target: {
                artist: artist,
                songName: song
            }
        });
    }

    useEffect(() => {
        document.title = 'GeniusStats';
    }, []);

    return (
        <>
            <div className="app-root">
                <div className="container">
                    <div className="row justify-content-center">
                        <h1 className="c-primary">GENIUSTATS</h1>
                    </div>
                    <div className="row pt-2">
                        <div className="col">
                            <p className="c-secondary">Artist Name</p>
                            <InputGroup size="lg">
                                <FormControl value={artist} onChange={onArtistChange} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Rick Astley" />
                            </InputGroup>
                        </div>
                        <div className="col">
                            <p className="c-secondary">Song Name</p>
                            <InputGroup size="lg">
                                <FormControl value={song} onChange={onSongChange} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Never Gonna Give You Up" />
                            </InputGroup>
                        </div>
                    </div>
                    <div className="row justify-content-center pt-2">
                        <div className="pt-3">
                            <Button disabled={!artist || !song} size="lg" onClick={onButtonClick}><i className="fa fa-magic"></i> Show Me Some Numbers</Button>
                        </div>
                    </div>
                    <div className="row pt-5">
                        <p className="c-secondary desc-text">Here's how it works: you type a music name, click on the button and then a very powerfull AI is going to analyse the lyrics and show you some really interesting statistics. Just kidding, it's not an AI...</p>
                    </div>
                    <div className="row pt-5">
                        <p className="c-secondary desc-text">Data gathered from <a href="https://genius.com">Genius.com</a>.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
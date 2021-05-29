import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';
import Spinner from 'react-bootstrap/Spinner';
import axios from '../../services/axios';
import { useHistory } from 'react-router';
import { store } from 'react-notifications-component';
import Button from 'react-bootstrap/esm/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];

const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload) {
        return (
            <div className="custom-tooltip">
                <p><span className="font-weight-bolder">{payload[0].payload.name}</span>:<span className="font-weight-bold">{payload[0].payload.occurrences}</span></p>
            </div>
        );
    }

    return null;
};

const CustomPieTooltip = ({ active, payload, label }) => {
    if (active && payload) {
        return (
            <div className="custom-tooltip">
                <p><span className="font-weight-bolder">{payload[0].payload.name}</span> occurrence happened <span className="font-weight-bold">{payload[0].payload.value}</span> times</p>
            </div>
        );
    }

    return null;
};

const ShowStats = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [art, setArt] = useState(null);
    const [youtube, setYoutube] = useState(null);
    const [rawWords, setRawWords] = useState([]);
    const [blacklist, setBlacklist] = useState('');
    const [statistics, setStatistics] = useState({});
    const [lyrics, setLyrics] = useState('');
    const [wordOccurrences, setWordOccurrences] = useState([]);
    const propsData = props.location.target;
    const history = useHistory();

    useEffect(() => {
        if (!propsData) {
            history.push('/');
        } else {
            loadData();
        }
    }, []);

    useEffect(() => {
        document.title = 'Loading...';
    }, []);

    const onBlacklistChange = (event) => {
        setBlacklist(event.target.value);
    }

    const processData = (data) => {
        const words = data.words;
        const occurrences = []; // chart data

        for (let i = 0; i < words.length; i++) {
            const oc = occurrences.find((occurrence) => occurrence.name === words[i].occurrences);

            if (!oc) {
                occurrences.push({
                    name: words[i].occurrences,
                    value: 1
                });
            } else {
                oc.value++;
            }
        }

        setStatistics(data.statistics);
        setWordOccurrences(occurrences);
    }

    const loadData = () => {
        axios.post('/genius/get-song', {
            artist: propsData.artist,
            songName: propsData.songName
        })
            .then((response) => {
                setRawWords(response.words);
                setArt(response.art);
                setLyrics(response.lyrics);
                processData(response);
                setYoutube(response.youtubeUrl);

                document.title = `${propsData.artist} - ${propsData.songName}`;
            })
            .catch((error) => {
                setError(error);
                document.title = 'Something went wrong :(';
            })
            .finally(() => {
                setLoading(false);
            })
    }

    if (loading) {
        return (
            <div className="app-root">
                <div className="container">
                    <div className="row justify-content-center">
                        <Spinner animation="border" role="status" variant="info" size="lg">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                </div>
            </div>
        );
    } else {
        if (error) {
            return (
                <div className="app-root">
                    <div className="container">
                        <div className="row justify-content-center">
                            <h1 className="text-danger">Something bad happend :(</h1>
                        </div>
                        <div className="row justify-content-center pt-2">
                            <p className="c-secondary">{error.code}</p>
                        </div>
                        <div className="row justify-content-center">
                            <p className="c-secondary">{error.data.error}</p>
                        </div>
                        <div className="row justify-content-center pt-5">
                            <Button size="sm" onClick={() => history.push('/')}><i className="fa fa-backward"></i> Take Me Back</Button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <div className="row justify-content-center pt-3">
                        <div className="col-8">
                            <div className="row justify-content-center">
                                <h1 className="c-primary">{propsData.artist} - {propsData.songName}</h1>
                            </div>
                            <div className="row justify-content-center pt-1">
                                <a href={youtube} target="_blank">
                                    <img src={art} style={{ width: '150px', height: '150px' }} />
                                </a>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="row flex-column justify-content-start">
                                <div style={{ width: '50%' }}>
                                    <Button size="sm" onClick={() => history.push('/')}><i className="fa fa-backward"></i> Take Me Back</Button>
                                </div>
                                <h3 className="c-secondary pt-3">Summary</h3>
                                <span style={{ borderBottom: '1px solid #30475e' }}></span>
                                <div className="pt-3">
                                    <p className="c-secondary">Total words: <span className="c-primary font-weight-bold">{statistics.wordCount}</span></p>
                                    <p className="c-secondary">Unique words: <span className="c-primary font-weight-bold">{statistics.uniqueWords}</span> <span className="c-primary" style={{ fontSize: '0.8rem' }}>{`${statistics.uniqueWordsPercent}%`}</span></p>
                                    <p className="c-secondary">Repeated words: <span className="c-primary font-weight-bold">{statistics.repeatedWords}</span> <span className="c-primary" style={{ fontSize: '0.8rem' }}>{`${statistics.repeatedWordsPercent}%`}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Accordion>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="button" eventKey="0">
                                        <span className="c-secondary">Toggle lyrics</span>
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body className="c-secondary" style={{ whiteSpace: "pre-wrap" }}>{lyrics}</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </div>
                    <div className="row justify-content-start pt-3">
                        <h4 className="c-secondary pt-3">Detailed Stats</h4>
                        <span style={{ borderBottom: '1px solid #30475e', width: '100%' }}></span>
                        <div className="pt-3" style={{ width: '100%' }}>
                            <div className="row">
                                <div className="col justify-content-center">
                                    <p className="c-secondary">Most used word: <span className="c-primary font-weight-bold">{rawWords[0].name}</span></p>
                                    <p className="c-secondary">Longest word: <span className="c-primary font-weight-bold">{statistics.longestWord}</span></p>
                                    <p className="c-secondary">Shortest word: <span className="c-primary font-weight-bold">{statistics.shortestWord}</span></p>
                                </div>
                                <div className="col">
                                    <p className="c-secondary">Is track title present in the lyrics: <span className="c-primary font-weight-bold">{statistics.foundTitleInLyrics ? 'Yes' : 'No'}</span></p>
                                    <p className="c-secondary">Number of lines: <span className="c-primary font-weight-bold">{statistics.lineCount}</span></p>
                                    <p className="c-secondary">Average words per line: <span className="c-primary font-weight-bold">{statistics.avgWordsPerLine}</span></p>
                                </div>
                            </div>
                            <div className="row pl-3">
                                <p style={{ 'fontSize': '0.8rem', 'fontStyle': 'italic', color: '#a0a0a0' }}>These statistics might be affected by typos, wrong lyrics, unexpected lyric structure, etc.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-start pt-3">
                        <h4 className="c-secondary pt-3">Bar Chart Word Distribution</h4>
                        <span style={{ borderBottom: '1px solid #30475e', width: '100%' }}></span>
                        <div className="pt-3" style={{ width: '100%', height: 500 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={rawWords}
                                    options={{
                                        legend: {
                                            display: false
                                        }
                                    }}
                                >
                                    <XAxis dataKey="word" />
                                    <YAxis />
                                    <Tooltip content={<CustomBarTooltip />} />
                                    <Bar dataKey="occurrences" fill="#457fb9" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="row justify-content-start pt-3">
                        <h4 className="c-secondary pt-3">Pie Chart Word Occurrence Distribution</h4>
                        <span style={{ borderBottom: '1px solid #30475e', width: '100%' }}></span>
                        <div style={{ width: '100%', height: 500 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        dataKey="value"
                                        isAnimationActive={false}
                                        data={wordOccurrences}
                                        fill="#8884d8"
                                        label
                                    >
                                        {wordOccurrences.map((entry, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="row flex-column justify-content-center pt-5" style={{ fontSize: '0.8rem' }}>
                        <span className="c-gray text-center">Created by <a href="https://diogomartino.com" target="_blank">Diogo Martino</a>.</span>
                        <span className="c-gray text-center">GENIUSTATS is a open source project. Feel free to join us on GitHub.</span>
                    </div>
                </div>
            );
        }
    }
}

export default ShowStats;
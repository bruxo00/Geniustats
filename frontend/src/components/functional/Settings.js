import React from 'react';

const Settings = () => {
    return (
        <div className="row flex-column justify-content-start">
            <h3 className="c-secondary">Settings</h3>
            <span className="c-secondary">Word Blacklist (CSV)</span>
            <InputGroup size="sm">
                <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Blacklist words eg: 'i,am,the,do'" />
            </InputGroup>
        </div>
    );
}

export default Settings;
import { Grid } from '@mui/material';
import React from 'react';

function Template ({ children }) {
    return (
        <div className="container">
            <main className='main'>
                {children}
            </main>
            <div className='menu'>
                menu
            </div>
        </div>
    );
}

export default Template;
import React from "react";
import {Box, Typography} from "@mui/material";
import RocketIcon from '@mui/icons-material/Rocket';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import ParaglidingIcon from '@mui/icons-material/Paragliding';

function StatePanel ({ active, icon, style }) {
    return <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        opacity: active ? '1' : '0.3',
        ...style,
    }}>
        {icon}
    </div>
}

function State ({ label, active, icon, style, prev }) {
    return <>
        {
            prev && <div style={{ opacity: active ? '1' : '0.3' }}>
                <img src={'/svg/arrow.svg'} />
            </div>
        }
        <Box px={1} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
            <StatePanel active={active} icon={icon} style={style}/>
            <Box pb={0.5} />
            <Typography variant={'caption'}>
                {label}
            </Typography>
        </Box>
    </>
}

function PayloadState ({ ascent, payloadRelease, autogiro, maxHighReached }) {
    return <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <State
            label={'Ascenso'}
            active={ascent}
            icon={<FlightTakeoffIcon />}
            style={{
                backgroundColor: 'rgba(255, 216, 10, 0.5)',
                border: '1px solid #FFD80A',
            }}
        />
        <State
            label={'Separación'}
            active={payloadRelease}
            icon={<ConnectingAirportsIcon />}
            prev
            style={{
                backgroundColor: 'rgba(254, 126, 33, 0.5)',
                border: '1px solid #FE7E21',
            }}
        />
        <State
            label={'Autogiro'}
            active={autogiro}
            icon={<ParaglidingIcon />}
            prev
            style={{
                backgroundColor: 'rgba(131, 221, 116, 0.5)',
                border: '1px solid #83DD74',
            }}
        />
        <State
            label={'Descenso'}
            active={maxHighReached}
            icon={<FlightLandIcon />}
            prev
            style={{
                backgroundColor: 'rgba(255, 216, 10, 0.5)',
                border: '1px solid #FFD80A',
            }}
        />
    </Box>
}

export default PayloadState;
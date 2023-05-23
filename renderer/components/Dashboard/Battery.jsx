import Battery0BarIcon from '@mui/icons-material/Battery0Bar';
import Battery1BarIcon from '@mui/icons-material/Battery1Bar';
import Battery2BarIcon from '@mui/icons-material/Battery2Bar';
import Battery3BarIcon from '@mui/icons-material/Battery3Bar';
import Battery4BarIcon from '@mui/icons-material/Battery4Bar';
import Battery5BarIcon from '@mui/icons-material/Battery5Bar';
import Battery6BarIcon from '@mui/icons-material/Battery6Bar';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryUnknownIcon from '@mui/icons-material/BatteryUnknown';
import { Box, styled } from '@mui/material';

function Battery ({ percentage }) {
    if (percentage === null || percentage === undefined) return <BatteryUnknownIcon color={'inherit'} />
    else if (percentage === 0) return <Battery0BarIcon color={'inherit'} />;
    else if (percentage > 0 && percentage < 15) return <Battery1BarIcon color={'inherit'} />;
    else if (percentage > 15 && percentage < 30) return <Battery2BarIcon color={'inherit'} />;
    else if (percentage > 30 && percentage < 45) return <Battery3BarIcon color={'inherit'} />;
    else if (percentage > 45 && percentage < 60) return <Battery4BarIcon color={'inherit'} />;
    else if (percentage > 60 && percentage < 75) return <Battery5BarIcon color={'inherit'} />;
    else if (percentage > 75 && percentage < 90) return <Battery6BarIcon color={'inherit'} />;
    else if (percentage > 90 && percentage <= 100) return <BatteryFullIcon color={'inherit'} />;
}

export default function BatteryLoader ({ percentage, direction }) {
    return <div style={{ transform: 'rotate(90deg)', width: 'fit-content', height: 'fit-content', color: '#00ff00' }}>
        <Battery percentage={percentage}/>
    </div>
}
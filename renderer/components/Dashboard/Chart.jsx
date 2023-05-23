import React from 'react';
import DashboardPanel from './DashboardPanel';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import {
    Chart as ChartJS, ArcElement, Tooltip, 
    Legend, CategoryScale, LinearScale,
    PointElement, LineElement
} from "chart.js";
import { Line } from "react-chartjs-2";
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

ChartJS.defaults.color = '#999999';
ChartJS.defaults.borderColor = 'rgba(228, 228, 228, 0.2)';

ChartJS.register(
    ArcElement, Tooltip, Legend, 
    CategoryScale, LinearScale,
    PointElement, LineElement
);

function DashboardChart ({ textLabel, showLabels = false, data }) {
    return <DashboardPanel>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant='subtitle' style={{ fontWeight: 'bold'}}>
                { textLabel }
            </Typography>
            <IconButton size='small'>
                <ZoomOutMapIcon fontSize='0.5rem' />
            </IconButton>
        </Stack>
        <Line
            height={'160px'}
            width={null}
            options={{
                responsive: true,
                animation: {
                    duration: 300
                },
                elements: {
                    point:{
                        radius: 0
                    }
                },
                scales: {
                    x: {
                        border: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        callback: function(val, index) {
                            // Hide every 2nd tick label
                            return index % 2 === 0 ? this.getLabelForValue(val) : '';
                        },
                    }
                },
                plugins: {
                    legend: {
                        display: showLabels
                    },
                }
            }}
            data={data}
        />
    </DashboardPanel>
}

export default DashboardChart;
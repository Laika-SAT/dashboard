import {Button, Typography, Box} from "@mui/material";

export default function DashboardFooter () {
    return <footer className={'d-footer'}>
        <div className={'d-footer-secondary-menu'}>
            <Box display={'flex'} alignItems={'center'} height={'60px'} px={2} justifyContent={'space-between'}>
                <Box>
                    <Button variant={'contained'} color={'secondary'} style={{ width: '20vw' }}>
                        Iniciar Misión
                    </Button>
                </Box>
                <Box>
                    <Button variant={'contained'} color={'secondary'}>
                        Descargar datos
                    </Button>
                </Box>
                
            </Box>
        </div>
        <div className={'d-footer-primary-menu'}>
            <div className={'left-side'}>
                <div className={'logo-container'}>
                    <img src={'/icons/logo.svg'} />
                </div>
                <div className={'d-footer-title'}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        LAIKA SAT
                    </Typography>
                </div>
            </div>
            <div className={'right-side'}>
            </div>
        </div>
    </footer>;
}
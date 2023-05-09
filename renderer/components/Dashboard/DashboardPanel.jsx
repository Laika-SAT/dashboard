import { Card, CardContent } from "@mui/material";

export default function DashboardPanel ({ children, ...props }) {
    return <Card className={'d-panel'} { ...props }>
        <CardContent className={'d-panel-container'}>
            {children}
        </CardContent>
    </Card>
}
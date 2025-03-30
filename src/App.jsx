// App.js
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ExcelUploader from './ExcelUploader';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const validUsername = 'admin';
    const validPassword = 'password123';

    const handleLogin = () => {
        if (username === validUsername && password === validPassword) {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Tên đăng nhập hoặc mật khẩu không đúng');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
    };

    const handleDataProcessed = (departments) => {
        // You can handle the processed data here if needed
        console.log('Processed departments:', departments);
    };

    if (!isLoggedIn) {
        return (
            <Container maxWidth="xs">
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="h5">Quản lý dữ liệu Type 2</Typography>
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <TextField fullWidth label="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mb: 2 }} />
                            <TextField fullWidth label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                            <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleLogin}>Đăng nhập</Button>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        );
    }

    return (
        <Box>
            <AppBar position="static" sx={{ bgcolor: '#1e2536' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Quản lý dữ liệu Type 2</Typography>
                    <Button color="inherit" onClick={handleLogout}>Đăng xuất</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Typography variant="h4">Dữ liệu CBCNV</Typography>
                <Typography variant="h5">Tải về file mẫu</Typography>

                <Typography variant="h5">Cập nhật dữ liệu CBCNV</Typography>
                <ExcelUploader onDataProcessed={handleDataProcessed} />
            </Container>
        </Box>
    );
}
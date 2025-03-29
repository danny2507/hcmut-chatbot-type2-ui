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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
                <Typography variant="h5">Dữ liệu CBCNV</Typography>
                <Button variant="contained" fullWidth sx={{ my: 2 }}>Tải lại dữ liệu CBCNV</Button>
                <Paper sx={{ mt: 2 }}>
                    <List>
                        {['Bộ môn Hệ thống & Mạng máy tính', 'Bộ môn Hệ thống Thông tin', 'Bộ môn Công nghệ Phần mềm', 'Bộ môn Kỹ thuật Máy tính', 'Bộ môn Khoa học Máy tính'].map((item, index) => (
                            <ListItem divider key={index}>
                                <ListItemText primary={item} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
                <Box mt={4}>
                    <Typography variant="h5">Thống kê nhân viên</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell>Bộ môn</TableCell>
                                    <TableCell align="right">Số lượng cán bộ</TableCell>
                                    <TableCell align="right">Tiến sĩ</TableCell>
                                    <TableCell align="right">Thạc sĩ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[
                                    { name: 'Hệ thống & Mạng máy tính', count: 12, phds: 5, masters: 7 },
                                    { name: 'Hệ thống Thông tin', count: 15, phds: 8, masters: 7 },
                                    { name: 'Công nghệ Phần mềm', count: 18, phds: 9, masters: 9 }
                                ].map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell align="right">{row.count}</TableCell>
                                        <TableCell align="right">{row.phds}</TableCell>
                                        <TableCell align="right">{row.masters}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </Box>
    );
}
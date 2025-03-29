import React from 'react';
import Button from '@mui/material/Button';
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
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as XLSX from 'xlsx';

// Component to display departments list
const DepartmentsList = ({ departments }) => (
    <Paper sx={{ mt: 2 }}>
        <List>
            {departments.map((dept, index) => (
                <ListItem divider key={index}>
                    <ListItemText primary={dept.name} />
                </ListItem>
            ))}
        </List>
    </Paper>
);

// Component to display full lecturers table preview
const LecturersTablePreview = ({ departments, roleKeys }) => (
    <Box mt={4}>
        <Typography variant="h5">Dữ liệu sẽ được nhập</Typography>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell>MSCB</TableCell>
                        <TableCell>Họ và tên đệm</TableCell>
                        <TableCell>Tên</TableCell>
                        <TableCell>Bộ môn</TableCell>
                        <TableCell>Học hàm/học vị</TableCell>
                        <TableCell>Ngạch</TableCell>
                        {roleKeys.map(role => (
                            <TableCell key={role}>{role}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departments.map(dept =>
                        dept.lecturers.map((lec, index) => (
                            <TableRow key={index}>
                                <TableCell>{lec.id || ''}</TableCell>
                                <TableCell>{lec.last_middle_name || ''}</TableCell>
                                <TableCell>{lec.first_name || ''}</TableCell>
                                <TableCell>{lec.department || ''}</TableCell>
                                <TableCell>{`${lec.degree || ''} ${lec.title || ''}`}</TableCell>
                                <TableCell>{lec.rank || ''}</TableCell>
                                {roleKeys.map(role => (
                                    <TableCell key={role}>{lec.roles[role] ? '1' : ''}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
);

// Main ExcelUploader component
const ExcelUploader = ({ onDataProcessed }) => {
    const [departments, setDepartments] = React.useState([]);
    const [fileName, setFileName] = React.useState(null);
    const [isConfirmed, setIsConfirmed] = React.useState(false);
    const [updateMessage, setUpdateMessage] = React.useState(null);

    const degreeMap = { 5: 'TS', 6: 'ThS', 7: 'KS', 8: 'CN' };
    const titleMap = { 9: 'GS', 10: 'PGS' };
    const rankMap = { 11: 'GVCC', 12: 'GVC', 13: 'GV', 14: 'TG', 15: 'KS', 16: 'NCV' };
    const roleKeys = ['Kiêm nhiệm', 'BC', 'HĐ T'];

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setIsConfirmed(false);
        setUpdateMessage(null);

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            let newDepartments = [];
            let currentDepartment = null;

            const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

            jsonData.slice(4).forEach((row) => {
                const cellA = row[0];
                if (!cellA) return;

                if (typeof cellA === 'string' && /[a-zA-Z]/.test(cellA)) {
                    currentDepartment = { name: cellA, lecturers: [] };
                    newDepartments.push(currentDepartment);
                    return;
                }

                if (isNumeric(cellA) && currentDepartment) {
                    let lecturer = {
                        id: row[2],
                        last_middle_name: row[3],
                        first_name: row[4],
                        department: currentDepartment.name,
                        degree: null,
                        title: null,
                        rank: null,
                        roles: roleKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
                    };

                    let degreeCols = row.slice(5, 9);
                    let degreeIndices = degreeCols.map((val, i) => (val === 1 ? i : -1)).filter(i => i !== -1);
                    if (degreeIndices.length === 1) {
                        lecturer.degree = degreeMap[5 + degreeIndices[0]];
                    }

                    let titleCols = row.slice(9, 11);
                    let titleIndices = titleCols.map((val, i) => (val === 1 ? i : -1)).filter(i => i !== -1);
                    if (titleIndices.length === 1) {
                        lecturer.title = titleMap[9 + titleIndices[0]];
                    }

                    let rankCols = row.slice(11, 17);
                    let rankIndices = rankCols.map((val, i) => (val === 1 ? i : -1)).filter(i => i !== -1);
                    if (rankIndices.length === 1) {
                        lecturer.rank = rankMap[11 + rankIndices[0]];
                    }

                    roleKeys.forEach((role, i) => {
                        if (row[17 + i] === 1) {
                            lecturer.roles[role] = 1;
                        }
                    });

                    currentDepartment.lecturers.push(lecturer);
                }
            });
            newDepartments = newDepartments.filter((department) => department.lecturers.length > 0);
            setDepartments(newDepartments);
            onDataProcessed(newDepartments);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleConfirm = () => {
        setIsConfirmed(true);
        // Randomly choose between success and error
        const isSuccess = Math.random() > 0.5;
        if (isSuccess) {
            setUpdateMessage({
                type: 'success',
                text: 'Dữ liệu đã được cập nhật thành công. Cảm ơn bạn!'
            });
        } else {
            setUpdateMessage({
                type: 'error',
                text: 'Rất tiếc, đã có lỗi xảy ra khi cập nhật dữ liệu. Vui lòng thử lại sau.'
            });
        }
    };

    return (
        <>
            <Box sx={{ my: 2 }}>
                <Button variant="contained" component="label">
                    Tải lên file Excel
                    <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileUpload} />
                </Button>
            </Box>

            {fileName && (
                <Box sx={{ my: 2 }}>
                    <Typography variant="body1">Tệp đã tải: {fileName}</Typography>
                    <Box sx={{ mt: 1 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ mr: 1 }}
                        >
                            Thay đổi tệp
                            <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileUpload} />
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleConfirm}
                            disabled={isConfirmed}
                        >
                            Xác nhận cập nhật dữ liệu
                        </Button>
                    </Box>
                    {updateMessage && (
                        <Typography
                            sx={{ mt: 1, color: updateMessage.type === 'success' ? 'green' : 'red' }}
                        >
                            {updateMessage.text}
                        </Typography>
                    )}
                </Box>
            )}

            {departments.length > 0 && (
                <>
                    <Typography variant="h5">Các bộ môn, phòng thí nghiệm</Typography>
                    <DepartmentsList departments={departments} />
                    <LecturersTablePreview departments={departments} roleKeys={roleKeys} />
                </>
            )}
        </>
    );
};

export default ExcelUploader;
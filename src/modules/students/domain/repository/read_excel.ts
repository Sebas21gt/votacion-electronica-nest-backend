import XLSX from 'xlsx';

async function processExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData.map(row => ({
        fullname: row['APELLIDOS Y NOMBRES'],
        collegeNumber: row['CU'],
        ciNumber: row['CI'],
        isHabilitated: true
    }));
}

export default processExcelFile;

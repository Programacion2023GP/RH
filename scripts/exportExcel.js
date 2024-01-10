export function exportToExcel(data,mySwal,title) {
    const worksheetData = data.map((item) => Object.values(item));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([Object.keys(data[0]), ...worksheetData]);
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const fileName = `${title}-WEB.xlsx`;   
    console.log(title);
    saveAs(blob, fileName); 
    mySwal.close();
}
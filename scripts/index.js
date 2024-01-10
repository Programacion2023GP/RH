import {
      getDB
    , formatJson
    ,addItemJson
} from './formatter.js';
const workbook = new ExcelJS.Workbook();
const titles = []
const rows = []
let titleOrigin = "";
let lastRow = 0         
let arrayNotIncludes =[]
let mySwal = undefined
let myData = undefined
init()
async function init() {
    myData = await getDB() 
}
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (event) => {
    titleOrigin = event.target.files[0].name.split('.')[0];
    mySwal = Swal.fire({
        title: event.target.value,
        icon: "",
        html: ``,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        showCancelButton: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
            Swal.showLoading(); // Mostrará el spinner de carga
        }

    });
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target.result;
            const buffer = new Uint8Array(data);
            await workbook.xlsx.load(buffer);

            const worksheet = workbook.getWorksheet(1);
            lastRow = worksheet.lastRow._number
            let limitCopy = 0
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber == 8) {
                    row.eachCell((cell, colNumber) => {
                        
                      
                       if (limitCopy== 0) {
                        const descripcion = myData.filter(json => json.descripcion != cell.value);
                        
                        if (descripcion.length > 0) {
                            myData.push({tipoconcepto:'N',descripcion:cell.value})
                            addItemJson(cell.value, 'N');
                        }
                        
                        titles.push(cell.value)   

                       }else{
                        arrayNotIncludes.push(cell.value)
                       }
                       if(cell.value == '*NETO*'){
                        limitCopy = colNumber
                       }
                    })

                }
                if (rowNumber > 9) {
                    let foundTotalGral = false;

                    let array = []
                    row.eachCell((cell, colNumber) => {
                        if (cell.value === 'Total Gral.') {
                            foundTotalGral = true;
                        }
                            if (colNumber<= limitCopy) {                                
                                array.push(cell.value)
                            }
                       
                     
                    })
                    if (foundTotalGral) {
                        return; // Saltar a la siguiente iteración
                    }
                    rows.push({
                        values: array
                    })
                }

                if (lastRow == rowNumber) {
                    formatJson(titles, rows, mySwal,titleOrigin,arrayNotIncludes)
                }
            });
        };
        reader.onerror = (event) => {
            console.error('Error al leer el archivo:', event.target.error);
        };

        reader.readAsArrayBuffer(file);
    }
});


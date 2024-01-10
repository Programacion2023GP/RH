import { exportToExcel } from './exportExcel.js';

let BD = undefined
export function formatJson(arrayTitles,arrayBody,mySwal, title,arrayNotIncludes){
    let newArrayJson =[]
    let json ={}
    let conditionPass = arrayTitles.length
    for (let i = 0; i < arrayTitles.length; i++) {
             json[arrayTitles[i]] = ''
    }
    for (let i = 0; i < arrayBody.length; i++) {
            let newJson = { ...json}
            if (arrayBody[i].values.length == conditionPass) {
                   Object.keys(json).forEach((key, index) => {
                    newJson[key] = arrayBody[i].values[index];
                });
                newArrayJson.push(newJson);
                
            }
            if (arrayBody.length-1 ==i) {
                searchItems(newArrayJson,mySwal,title,arrayNotIncludes)
            }
    }

  
}





export async function getDB(){
    try {
        const request = await fetch('../BD/db.json');
        const response = await request.json();

        BD = response
        return response
} catch (error) {
        console.error('Error al obtener el archivo JSON:', error);
        
    }
}

function searchItems(array,mySwal,title,arrayNotIncludes){
   
   const rows = []
   for (let i = 0; i < array.length; i++) {
    let newJson = {};
    let percepciones = 0;
    let deducciones = 0;
    let item = array[i];
    
    newJson['Código'] = array[i]['Código'];
    newJson['Empleado'] = array[i]['Empleado'];
    for (let j = 0; j < BD.length; j++) {
        let element = BD[j];
        if (!arrayNotIncludes.includes(element.descripcion)) {
            
            newJson[element.descripcion] = 0;
        }       

    }
    for (let key in item) {
      


        for (let j = 0; j < BD.length; j++) {
            let element = BD[j];

            if (element.descripcion === key) {
                // if (element.descripcion =='Pension Alimenticia 2') {
                // }

                // if (element.tipoconcepto === "D") {
                //     deducciones += item[key];
                // }
                // if (element.tipoconcepto === "P") {
                //     percepciones += item[key];
                // }
                newJson[element.descripcion] = item[key];
            }
          
        }
     


    }
    
    
    newJson['*TOTAL* *DEDUCCIONES*'] = array[i]['*TOTAL* *DEDUCCIONES*'];
    newJson['*Otras* *Deducciones*'] =array[i]['*Otras* *Deducciones*'] ;
    newJson['*TOTAL* *PERCEPCIONES*'] = array[i]['*TOTAL* *PERCEPCIONES*'];
    newJson['*Otras* *Percepciones*'] = array[i]['*Otras* *Percepciones*'];
    newJson['*NETO*'] = array[i]['*NETO*'];
    newJson['Numero_Cheque'] = '';
    newJson['Numero_Poliza'] = '';
    newJson['Identificacion_Recurso'] = 40;

    
    rows.push(newJson);

    if (array.length-1 ==i) {
        exportToExcel(rows,mySwal,title)
    }
    else{

    }
}


       
    
}

export function addItemJson(descripcion,tipoconcepto){
    BD.push({
        tipoconcepto,
        descripcion
    })
}
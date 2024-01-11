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
        const percepciones =[]
        const deducciones =[]
        BD = await response.forEach((item)=>{
            if (item.tipoconcepto == 'P') {
                percepciones.push(item)
            }
            if (item.tipoconcepto == 'D') {
                deducciones.push(item)

            }
        })
      
        BD = [...percepciones,
            {
                "numeroconcepto": 34234243,
                "tipoconcepto": "T",
                "descripcion": "*TOTAL* *PERCEPCIONES*"
            },
            {
                "numeroconcepto": 34234243,
                "tipoconcepto": "T",
                "descripcion": "*Otras* *Percepciones*"
            },
            ...deducciones,
            {
                "numeroconcepto": 13123123,
                "tipoconcepto": "T",
                "descripcion": "*TOTAL* *DEDUCCIONES*"
            },
            {
                "numeroconcepto": 34234243,
                "tipoconcepto": "T",
                "descripcion": "*Otras* *Deducciones*"
            }
        ]
        return response
} catch (error) {
        console.error('Error al obtener el archivo JSON:', error);
        
    }
}

function searchItems(array,mySwal,title,arrayNotIncludes){
   
   const rows = []
   for (let i = 0; i < array.length; i++) {
    let newJson = {
       
    };
  
    let item = array[i];
    
    newJson['Código'] = array[i]['Código'];
    newJson['Empleado'] = array[i]['Empleado'];
    for (let j = 0; j < BD.length; j++) {
        let element = BD[j];
        
        if (!arrayNotIncludes.includes(element.descripcion)) {
            // console.warn(element.tipoconcepto)
            newJson[element.descripcion] = 0;
            // newJson['tipoconcepto'] = element.tipoconcepto;
            // console.error(newJson.tipoconcepto)
            
            
        }     
        // newJson['tipoconcepto'] = element.tipoconcepto;
    }
    // console.warn(newJson)

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
              
                // console.warn(element.descripcion)
                newJson[element.descripcion] = item[key];
            }
          
        }
     


    }
    
    
  
    newJson['*NETO*'] = array[i]['*NETO*'];
    newJson['Numero_Cheque'] = '';
    newJson['Numero_Poliza'] = '';
    newJson['Identificacion_Recurso'] = 40;

    
    rows.push(newJson);

    if (array.length-1 ==i) {
        console.warn(rows)
        const deducciones = []
        const percepciones = []
        const arrayOrdenado = rows.forEach((element, indice) => {
            if (element.tipoconcepto == 'D') { 
                deducciones.push(element)
            }
            else if (element.tipoconcepto == 'P'){
                percepciones.push(element)

            }
        });

        //   console.warn(percepciones,deducciones)
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
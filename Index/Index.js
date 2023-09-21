const fs = require('fs');
const BTree = require('../Btree/Btree.js');
const prompt = require('prompt-sync')();
const KeyValuePair = require('../Btree/KeyValuePair.js');
console.log("Bienvenido!");
fs.readFile("C:/Users/50255/Desktop/URL/Sexto ciclo/Estructura 2/Lab/Lab1/Datos2.csv", 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return;
    }

    const lines = data.split('\n');
    const bTree = new BTree(4); 
    for (const line of lines) {
      const [action, data] = line.split(';');
      if (action && data) {
        if(action == "INSERT"){
            debugger
            var value = JSON.parse(data);                        
            value["companies"] = value["companies"].map((C) =>
              {
                let input_insert = value["dpi "] + C;
                return bTree.compressLZ78(input_insert);
              });
            let kvp = new KeyValuePair(value["dpi"], value);
            console.log("Datos ingresado 😎");
            bTree.insert(kvp);
          }else if(action == "PATCH"){
            var value = JSON.parse(data);
            value["companies"] = value["companies"].map((C) =>
              {
                let input_patch = value["dpi "] + C;
                return bTree.compressLZ78(input_patch);
              });
           bTree.patch(value["dpi"], value);
           console.log("Datos actualizado 👌");
          }else if(action == "DELETE"){
            var value = JSON.parse(data);
            console.log("Datos eliminado ☠️");
            bTree.delete(value["dpi"]);
          }
        }
    }
    console.log("1. Buscar cifrado");
    console.log("2. Buscar decifrado");
    console.log("3. Exit");
    var salida;
  do {

    const choice = prompt('Ingrese una opción: ');
    switch (choice) {
      case "1":
        var DPI = prompt('Ingrese el DPI de la persona que desea buscar: ');
        bTree.search(DPI);          
        break;
        case "2":
          var code = prompt('Ingrese contraseña')
          if(code == 123)
          {
            var DPIencryption = prompt('Ingrese el DPI de la persona que desea buscar: ');
            bTree.search(DPIencryption);          
          }
        break;
          case "3":
            console.log("¡Hasta luego!");
            break;
            default:
              console.log("Opción inválida");
              break;
          }
      salida = choice; 
    }while(salida != "3");
});


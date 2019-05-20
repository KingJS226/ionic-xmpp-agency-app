/**
* Js con logica de File Upload
*
* Contine funcion que permite hacer la instancia del los objetos File Upload
*
* @author Desarrollado por Frank Quero para Gearlabs Chile; querof@gmail.com
*/


/**
 * @var newjsonClass variable que almacena las instancias de los objetos file input.
 */

var newjsonClass = {};

 /**
  * Función utilizada para llamar instancias de objetos fileInput, e imprimir información de archivos, progreso de subida y estatus de esta.
  *
  * @param   debug integer, valores: 1 imprime en la consola el estatus de cada llamada, o y vacio no realiza impresión alguna.
  * @param   cancelar integer, valores: 1 cancela el proceso de upload del archivo ientificado en el parametro idUpload, 0 y
  *          vacio no realiza acción alguna.
  * @param   idUpload String, valores: string que representa en el arreglo newjsonClass una posisión que contiene un objeto fileInput, 0 y
  *          vacio no realiza acción alguna.
  * @return json  con información del archivo y el proceso de upload.
  */
 function enviaArchivo(debug,cancelar,idUpload)
{
  if(idUpload==0){
    idUpload =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);// Math.floor(Math.random() * 6) + 1;
    newjsonClass[idUpload] = new jsonClass({ idUpload: idUpload, error: 1, porcentaje: 0 });

  }

  if(cancelar==1) newjsonClass[idUpload].cancel();
  if(newjsonClass[idUpload] && debug ==1)
  {
    console.log(newjsonClass[idUpload].returnVarsArray());

    return newjsonClass[idUpload].returnVarsArray();
  }
  if(debug ==1) console.log('No existe e objecto identificado con el idUpload: ' + idUpload);

    return null;
}

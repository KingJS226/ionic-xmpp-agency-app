/**
* Prototipo que representa la clase de objeto json de respuesta
*
* Crea las instancia de los bjetos fileInput y file Upload de Jquery, adicionalmente realiza
* todo el control de comunicación con el servidor durante todo el proceso de upload.
*
* @author Desarrollado por Frank Quero para Gearlabs Chile; querof@gmail.com
*/

var jsonClass = function(options){


   /**
    * @var vars Variables accesadas en la clase; ellas repesentan la estructura de la respuesta json.
    */

   var vars = {
     nombreArchivo: null, //tipo texto (máximo 128)
     URLarchivo: null,// tipo URL (máximo 256)
     ext: null, //tipo texto (máximo 10)
     error: null, //tipo numero (entero)
     idUpload: null, // = Math.floor(Math.random()*6)+1; //tipo texto
     porcentaje: 0, //tipo numero (entero)
   };

   /**
    * @var root representa el prototipo u objeto en si.
    * @var fileInput representa el objeto inputFile instanciado en cada llamada,
    *      este es utlizado por Jquery para tomar el archivo.
    * @var xhr objeto que contiene el hilo de colunicación entre el servidor y jquery,
    *      a traves de el se puede cancelar el proceso.
    * @var rarId representa el PK de la tabla referencias_archivos.
    */

   var root = this;
   var fileInput;
   var xhr;
   var rarId = null;

   /**
    * Constructor de la clase, inicializa el proceso
    */

   this.construct = function(options){
       $.extend(vars , options);
       crearInput();
       $(fileInput).trigger("click");
   };

   /**
    * Retorna el avance del proceso.
    *
    * @return vars.porcentaje integer.
    */

   this.getAvance = function(){
       return vars.porcentaje;
   };

   /**
    * Permite cancelar el proceso de subida de archivos, mientras este no halla culminado.
    *
    */

   this.cancel = function(){
       xhr.abort();
       $.extend( vars, { error: -1});
       xhr = null;
   };

   /**
    * Retorna objeto Json a partir de la variable vars.
    *
    */

   this.returnJson = function(){
       return JSON.stringify(vars);
   };

   /**
    * Retorna la variable vars.
    *
    */

   this.returnVarsArray = function(){
       return vars;
   };

   /**
    * Instancia los objetos input file, y controla todo el proceso de upload de archivos,
    * utilizando para ello el componente Upload file de Jquery.
    *
    * @return retorna el resultado del proceso durante su ejecución y actualiza la variable vars.
    */

   var crearInput = function(){
     fileInput = $('<input id="fileupload" type="file" name="files[]" data-url="'+uploadPath+'"   style="display: none">');

     return $(function () {
          $(fileInput).fileupload({
             dataType: 'json',
             maxChunkSize: maxChunkSize,
             done: function (e, data) {
               $.extend( vars, { URLarchivo: data.result.URLarchivo, error: 0});
             },
             progressall: function (e, data) {
                       $.extend( vars, { porcentaje: parseInt(data.loaded / data.total * 100, 10) } );
                   },
             fail: function(e,data){
                $.extend( vars, { error: -3 });
                $.getJSON(rollbackPath+'/'+rarId, function (result){console.log(result.mensaje);});
             }
         }).bind('fileuploadadd', function (e, data) {
               var error = 1;
               $.getJSON(donePath, function (result)
               {
                    console.log(result.mensaje);
               });
               xhr = data.submit();
               if(data.files.size > maxFileSize)
               {
                 error = -2;
                 xhr.abort();
               }
               $.extend( vars, {error: error});
               return vars;
             })
           .bind('fileuploadchange', function (e, data) {
             var fileName = data.files[0].name;
             $.extend( vars, { nombreArchivo: fileName, ext: fileName.substr(fileName.lastIndexOf('.'))});
               console.log("vars=>", vars);
           })
           .on('fileuploadchunkdone', function (e, data) {
               console.log("vars=>", vars);
                 rarId = data.result.rarId;
               });
     });
   }


   /*
    * Llamada al constructor
    */

   this.construct(options);

};

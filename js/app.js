/*Listado de arquitecturas disponibles*/
var architecture_available = [];

/*Arquitectura cargada*/
var architecture = [

  components = [],

  /*Contenido del JSON MIPS*/
  /*components = [
    {name:"Integer control registers", index:1},
    {name:"Integer registers", index:2},
    {name:"Floating point control registers", index:3},
    {name:"Simple floating point registers", index:4},
    {name:"Double floating point registers", index:5},
  ],

  contr_int_reg =[
    {name:"PC", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
    {name:"EPC", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
    {name:"CAUSE", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
    {name:"BADVADDR", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
    {name:"STATUS", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
    {name:"HI", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
    {name:"LO", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
  ],

  int_reg = [],

  contr_fp_reg =[
    {name:"FIR", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
    {name:"FCSR", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
    {name:"FCCR", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
    {name:"FEXR", nbits:"32", value:0, default_value:0, properties: ["read", "write"]},
  ],

  fp_reg_single_precision=[],
  fp_reg_double_precision=[],*/
]

var memory = [
  { Address: "0x01003-0x01000", Binary: "61 65 6c 50", Tag: 'a', Value: null },
  { Address: "0x01007-0x01004", Binary: "61 65 6c 50", Tag: 'b', Value: 30 },
  { Address: "0x0100b-0x01008", Binary: "61 65 6c 50", Tag: 'msg', Value: "hello wold" },
  { Address: "0x0100f-0x0100c", Binary: "61 65 6c 50", Tag: 'msg2', Value: "Please, press letter '0' to end the 'echo' effect" },
]

var  instructions = [
  { Break: null, Address: "0x8000", Label: "main", Pseudo: "la $26 msg", Assebly: "la $26 msg" },
  { Break: null, Address: "0x8004", Label: "loop1", Pseudo: "lb $27 ($26)", Assebly: "lb $27 ($26)" },
  { Break: null, Address: "0x8008", Label: "", Pseudo: "li $1 0", Assebly: "li $1 0" },
  { Break: null, Address: "0x800c", Label: "", Pseudo: "beq $27 $1 end1", Assebly: "beq $27 $1 end1" },
]

/*Variables que almacenan el codigo introducido*/
var code_assembly = '';
var code_assDef = '';

function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

function binaryStringToInt( b ) {
    return parseInt(b, 2);
}

window.app = new Vue({
  el: "#app",
  data: {

    /*ALERTA*/
    alertMessaje: '',
    dismissSecs: 3,
    dismissCountDown: 0,

    /*PAGINA CARGA*/
    /*Configuraciones Disponibles*/
    arch_available: architecture_available,
    /*Numero de bits*/
    number_bits: 0,
    /*Nombre del fichero a cargar*/
    load_arch: '',
    /*Nombre del fichero a guardar*/
    name_arch_save: '',

    /*CARGA Y LECTURA ENSAMBLADOR Y DEFINICION*/
    /*Variables donde se guardan los contenidos de los textarea*/
    text_assDef: code_assDef,
    text_assembly: code_assembly,
    /*Variables donde se guardan los ficheros cargados*/
    load_assembly: '',
    load_assDef: '',
    /*Variables donde se guardan los nombre de los ficheros guardados*/
    save_assembly: '',
    save_assDef: '',

    /*Edicion del ensamblador*/
    formArchitecture: {
      name: '',
      defValue: '',
      properties: [],
    },


    /*PAGINA SIMULADOR*/
    /*Nuevo valor del registro*/
    newValue: '',


    /*SE CREA SEGUN JSON*/
    /*Definicion de posiciones:
     * 0- Components
     * 1- reg_int_contr
     * 2- reg_int
     * 3- reg_fp_contr
     * 4- reg_fp_single
     * 5- reg_fp_double
     */
    architecture: architecture,

    /*Asignacion de valores de la tabla de memoria*/
    memory: memory,
    /*Asignacion de valores de la tabla de instrucciones*/
    instructions: instructions,

  },
  computed: {
    
  },
  methods:{
    /*ALERTA*/
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },

    /*PAGINA CARGA*/
    /*Carga las arquitecturas que hay disponibles*/
    load_arch_available(){
      $.getJSON('architecture/available_arch.json', function(cfg){
        architecture_available = cfg;
        app._data.arch_available = cfg;
      })
    },

    /*Carga la arquitectura seleccionada*/
    load_arch_select(e){
      $.getJSON('architecture/'+e+'.json', function(cfg){
        architecture = cfg;

        /*for (var i = 0; i < 32; i++) {
          architecture[2].push({name:"R"+i, nbits: "32", value:0, default_value:0, properties: ["read", "write"]});
        }
        for (var i = 0; i < 32; i++) {
          architecture[4].push({name:"FG"+i, nbits: "32", value:0.0, default_value:0.0, properties: ["read", "write"]});
        }
        for (var i = 0; i < 16; i++) {
          architecture[5].push({name:"FP"+(i*2), nbits: "64", value:0.0, default_value:0.0, properties: ["read", "write"]});
        }*/

        app._data.architecture = architecture;

        $(".btn_arch").show();

        app._data.alertMessaje = 'The selected architecture has been loaded correctly';
        app._data.dismissCountDown = app._data.dismissSecs;

      });
    },

    /*Lectura del JSON de la arquitectura seleccionada*/
    read_arch(e){
      var file;
      var reader;
      var files = document.getElementById('arch_file').files;

      for (var i = 0; i < files.length; i++) {
        file = files[i];
        reader = new FileReader();
        reader.onloadend = onFileLoaded;
        reader.readAsBinaryString(file);
      }

      function onFileLoaded(event) {
        architecture = JSON.parse(event.currentTarget.result);

        app._data.architecture = architecture;

        $(".btn_arch").show();
        
        app._data.alertMessaje = 'The selected architecture has been loaded correctly';
        app._data.dismissCountDown = app._data.dismissSecs;
      }
    },

    /*Guarda la arquitectura actual en un JSON*/
    arch_save(){
      var textToWrite = JSON.stringify(architecture, null, 2);
      var textFileAsBlob = new Blob([textToWrite], { type: 'text/json' });
      var fileNameToSaveAs = this.name_arch_save + ".json";

      var downloadLink = document.createElement("a");
      downloadLink.download = fileNameToSaveAs;
      downloadLink.innerHTML = "My Hidden Link";

      window.URL = window.URL || window.webkitURL;

      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);

      downloadLink.click();
      app._data.alertMessaje = 'Save architecture';
      app._data.dismissCountDown = app._data.dismissSecs;
    },

    newComponent(){
      var newComp = {name: this.formArchitecture.name, index: architecture[0].length + 1};
      architecture[0].push(newComp);
      newComp = [];
      architecture.push(newComp);
      this.formArchitecture.name='';
    },

    newParameter(comp){
      for (var i = 0; i < architecture[0].length; i++) {
        if(comp == architecture[0][i].name && (i==0 || i==1 || i==2)){
          var newPar = {name:this.formArchitecture.name, nbits: this.number_bits, value: bigInt(parseInt(this.formArchitecture.defValue) >>> 0, 10).value, default_value:bigInt(parseInt(this.formArchitecture.defValue) >>> 0, 10).value, properties: this.formArchitecture.properties};
          architecture[i+1].push(newPar);
          this.formArchitecture.name='';
          this.formArchitecture.defValue='';
          this.formArchitecture.properties=[];
          break;
        }
        if(comp == architecture[0][i].name && (i==3 || i==4)){
          var newPar = {name:this.formArchitecture.name, nbits: this.number_bits*2, value:parseFloat(this.formArchitecture.defValue), default_value:parseFloat(this.formArchitecture.defValue), properties: this.formArchitecture.properties};
          architecture[i+1].push(newPar);
          this.formArchitecture.name='';
          this.formArchitecture.defValue='';
          this.formArchitecture.properties=[];
          break;
        }
      }
    },

    /*CARGA Y LECTURA ENSAMBLADOR Y MICROCODIGO*/
    /*Funciones de carga y descarga de microcodigo y ensamblador*/
    read_assembly(e){
      var file;
      var reader;
      var files = document.getElementById('assembly_file').files;

      for (var i = 0; i < files.length; i++) {
        file = files[i];
        reader = new FileReader();
        reader.onloadend = onFileLoaded;
        reader.readAsBinaryString(file);
      }

      function onFileLoaded(event) {
        code_assembly = event.currentTarget.result;
      }
    },

    assembly_update(){
      this.text_assembly = code_assembly;
    },

    assembly_save(){
      var textToWrite = this.text_assembly;
      var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
      var fileNameToSaveAs = this.save_assembly + ".txt";

      var downloadLink = document.createElement("a");
      downloadLink.download = fileNameToSaveAs;
      downloadLink.innerHTML = "My Hidden Link";

      window.URL = window.URL || window.webkitURL;

      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);

      downloadLink.click();
    },

    read_assDef(e){
      var file;
      var reader;
      var files = document.getElementById('assDef_file').files;

      for (var i = 0; i < files.length; i++) {
        file = files[i];
        reader = new FileReader();
        reader.onloadend = onFileLoaded;
        reader.readAsBinaryString(file);
      }

      function onFileLoaded(event) {
        code_assDef = event.currentTarget.result;
      }
    },

    assDef_update(){
      this.text_assDef = code_assDef;
    },

    assDef_save(){
      var textToWrite = this.text_assDef;
      var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
      var fileNameToSaveAs = this.save_assDef + ".txt";

      var downloadLink = document.createElement("a");
      downloadLink.download = fileNameToSaveAs;
      downloadLink.innerHTML = "My Hidden Link";

      window.URL = window.URL || window.webkitURL;

      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);

      downloadLink.click();
    },

    /*PAGINA SIMULADOR*/
    /*Funciones de los popover*/
    popoverId(i){
      return 'popoverValueContent' + i;
    },

    /*Convierte de hexadecimal a float*/
    hex2float ( hexvalue ){
      var sign     = (hexvalue & 0x80000000) ? -1 : 1;
      var exponent = ((hexvalue >> 23) & 0xff) - 127;
      var mantissa = 1 + ((hexvalue & 0x7fffff) / 0x800000);

      var valuef = sign * mantissa * Math.pow(2, exponent);
      if (-127 == exponent)
        if (1 == mantissa)
          valuef = (sign == 1) ? "+0" : "-0" ;
        else valuef = sign * ((hexvalue & 0x7fffff) / 0x7fffff) * Math.pow(2, -126) ;
      if (128 == exponent)
        if (1 == mantissa)
          valuef = (sign == 1) ? "+Inf" : "-Inf" ;
        else valuef = "NaN" ;

      return valuef ;
    },

    hex2double ( hexvalue ){
      /*var sign     = (hexvalue & 0x8000000000000000) ? -1 : 1;
      var exponent = ((hexvalue >> 52) & 0x7ff) - 1023;
      var mantissa = 1 + ((hexvalue & 0xfffffffffffff) / 0x10000000000000);



      console.log(sign);
      console.log((hexvalue).toString(2));

      var valuef = sign * mantissa * Math.pow(2, exponent);
      if (-1023 == exponent)
        if (1 == mantissa)
          valuef = (sign == 1) ? "+0" : "-0" ;
        else valuef = sign * ((hexvalue & 0xfffffffffffff) / 0xfffffffffffff) * Math.pow(2, -1022) ;
      if (1024 == exponent)
        if (1 == mantissa)
          valuef = (sign == 1) ? "+Inf" : "-Inf" ;
        else valuef = "NaN" ;

      return valuef ;*/

      /*Cogido de github https://github.com/bartaz/ieee754-visualization licencia MIT teoria libre*/

      var value = hexvalue.split('x');
      var value_bit = '';

      for (var i = 0; i < value[1].length; i++) {
      	var aux = value[1].charAt(i);
      	aux = (parseInt(aux, 16)).toString(2).padStart(4, "0");
      	value_bit = value_bit + aux;
      }

	  	var buffer = new ArrayBuffer(8);
		  new Uint8Array( buffer ).set( value_bit.match(/.{8}/g).map( binaryStringToInt ) );
		  return new DataView( buffer ).getFloat64(0, false);


    },

    /*Convierte de hexadecimal a char*/
    hex2char8 ( hexvalue ){

    	var num_char = ((hexvalue.toString().length)-2)/2;
    	var exponent = 0;
    	var pos = 0;

      var valuec = new Array();

      for (var i = 0; i < num_char; i++) {
      	var dec_mask = (15 * Math.pow(16,exponent)) + (15 * Math.pow(16,exponent+1));
      	exponent = exponent + 2;
      	valuec[i] = String.fromCharCode((hexvalue & dec_mask) >> pos);
      	pos = pos + 8;
      }

      var characters = '';

      for (var i = 0; i < valuec.length; i++) {
        characters = characters + valuec[i] + ' ';
      }

      return  characters;
    },

    float2bin (number){
	    var i, result = "";
	    var dv = new DataView(new ArrayBuffer(4));

	    dv.setFloat32(0, number, false);

	    for (i = 0; i < 4; i++) {
	        var bits = dv.getUint8(i).toString(2);
	        if (bits.length < 8) {
	            bits = new Array(8 - bits.length).fill('0').join("") + bits;
	        }
	        result += bits;
	    }
	    return result;
    },

    double2bin(number) {
	    var i, result = "";
	    var dv = new DataView(new ArrayBuffer(8));

	    dv.setFloat64(0, number, false);

	    for (i = 0; i < 8; i++) {
	        var bits = dv.getUint8(i).toString(2);
	        if (bits.length < 8) {
	            bits = new Array(8 - bits.length).fill('0').join("") + bits;
	        }
	        result += bits;
	    }
	    return result;
		},

    bin2hex(s) {
	    var i, k, part, accum, ret = '';
	    for (i = s.length-1; i >= 3; i -= 4) {

	      part = s.substr(i+1-4, 4);
	      accum = 0;
	      for (k = 0; k < 4; k += 1) {
          if (part[k] !== '0' && part[k] !== '1') {     
              return { valid: false };
          }
          accum = accum * 2 + parseInt(part[k], 10);
	      }
	      if (accum >= 10) {
          ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
	      } else {
          ret = String(accum) + ret;
	      }
	    }

	    if (i >= 0) {
        accum = 0;
        for (k = 0; k <= i; k += 1) {
          if (s[k] !== '0' && s[k] !== '1') {
              return { valid: false };
          }
          accum = accum * 2 + parseInt(s[k], 10);
        }
        ret = String(accum) + ret;
	    }
	    return ret;
		},

    /*FUNCIONES DE GESTION DE REGISTROS*/
    /*Funcion que resetea todos los registros*/
    reset(){
      for (var i = 0; i < architecture[1].length; i++) {
         architecture[1][i].value =  architecture[1][i].default_value;
      }
      for (var i = 0; i < architecture[2].length; i++) {
        architecture[2][i].value = architecture[2][i].default_value;
      }
      for (var i = 0; i < architecture[3].length; i++) {
        architecture[3][i].value = architecture[3][i].default_value;
      }
      for (var i = 0; i < architecture[4].length; i++) {
        architecture[4][i].value = architecture[4][i].default_value;
      }
      for (var i = 0; i < architecture[5].length; i++) {
        architecture[5][i].value = architecture[5][i].default_value;
      }
    },

    /*Funciones de actualizacion de los valores de los registros de control enteros*/
    updateIntcontr(j){
      for (var i = 0; i < architecture[1].length; i++) {
        if(architecture[1][i].name == j && this.newValue.match(/^0x/)){
          var value = this.newValue.split("x");
          architecture[1][i].value = bigInt(value[1], 16);
        }
        else if(architecture[1][i].name == j && this.newValue.match(/^(\d)+/)){
          architecture[1][i].value = bigInt(parseInt(this.newValue) >>> 0, 10);
        }
        else if(architecture[1][i].name == j && this.newValue.match(/^-/)){
          architecture[1][i].value = bigInt(parseInt(this.newValue) >>> 0, 10);
        }
      }
      this.newValue = '';
    },

    updateIntReg(j){
      for (var i = 0; i < architecture[2].length; i++) {
        if(architecture[2][i].name == j && this.newValue.match(/^0x/)){
          var value = this.newValue.split("x");
          architecture[2][i].value = bigInt(value[1], 16);
        }
        else if(architecture[2][i].name == j && this.newValue.match(/^(\d)+/)){
          architecture[2][i].value = bigInt(parseInt(this.newValue) >>> 0, 10);
        }
        else if(architecture[2][i].name == j && this.newValue.match(/^-/)){
          architecture[2][i].value = bigInt(parseInt(this.newValue) >>> 0, 10);
        }
      }
      this.newValue = '';
    },

    updateRegFpContr(j){
      for (var i = 0; i < architecture[3].length; i++) {
        if(architecture[3][i].name == j && this.newValue.match(/^0x/)){
          var value = this.newValue.split("x");
          architecture[3][i].value = bigInt(value[1], 16);
        }
        else if(architecture[3][i].name == j && this.newValue.match(/^(\d)+/)){
          architecture[3][i].value = bigInt(parseInt(this.newValue) >>> 0, 10);
        }
        else if(architecture[3][i].name == j && this.newValue.match(/^-/)){
          architecture[3][i].value = bigInt(parseInt(this.newValue) >>> 0, 10);
        }
      }
      this.newValue = '';
    },

    /*Revisar cuando es hexadecimal ya que no lo hace bien por la funcion que pasa a binario*/
    updateRegFpSingle(j){
      for (var i = 0; i < architecture[4].length; i++) {
        if(architecture[4][i].name == j && this.newValue.match(/^0x/)){
          architecture[4][i].value = this.hex2float(this.newValue);
        }
        else if(architecture[4][i].name == j && this.newValue.match(/^(\d)+/)){
          architecture[4][i].value = parseFloat(this.newValue, 10);
        }
        else if(architecture[4][i].name == j && this.newValue.match(/^-/)){
        	architecture[4][i].value = parseFloat(this.newValue, 10);
        }
      }
      this.newValue = '';
    },
    /*Revisar cuando es hexadecimal ya que coge el float*/
    updateRegFpDouble(j){
      for (var i = 0; i < architecture[5].length; i++) {
        if(architecture[5][i].name == j && this.newValue.match(/^0x/)){
          architecture[5][i].value = this.hex2double(this.newValue);
        }
        else if(architecture[5][i].name == j && this.newValue.match(/^(\d)+/)){
          architecture[5][i].value = parseFloat(this.newValue, 10);
        }
        else if(architecture[5][i].name == j && this.newValue.match(/^-/)){
        	architecture[5][i].value = parseFloat(this.newValue, 10);
        }
      }
      this.newValue = '';
    },
  },
  created(){
    this.load_arch_available();
  }
})

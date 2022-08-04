import * as readline from 'readline';
import {parse} from "./parser.js"
import {parse as interprete} from "./parser2.js"
/*La funcion showTokens convierte el arreglo de string en una unica string
 * */
function showTokens(array : Array<string>) : string {
	var arreglo : string = "";
	for (var i = 0; i < array.length-1; i++) {
		if (i%2==0){
			if (array[i] == "TkAtomo" || array[i] == "TkVariable"){
				arreglo = arreglo + " " + array[i] + "(" + array[i+1] + ")";
			}
			else{
				arreglo = arreglo + " " +array[i];
			}
		}
	}
	return arreglo;
  }
/*La funcion saveInArray guarda un string del AST en un array
 **/
function saveInArray(siguiente, array : Array<string>) :  void {
    while(siguiente != undefined){
    	   array.push(siguiente.kind);
    	   array.push(siguiente.value);
    	   siguiente = siguiente.next[0];
    }
  }
/*La funcion saveTokens guarda los tokens en un array.
 * */
function saveTokens(input) : Array<string> {
	var parseo = parse(input);
	var arreglo : Array<string> = [];
	if (parseo.ast != undefined || parseo.ast != null){
		saveInArray(parseo.ast.start,arreglo);
	}
	return arreglo;
  }

/*La funcion lexear toma la intruccion del usuario y lo convierte a tokens
 * en forma de string
 * */
function lexear(instruccion : string) : string {
	var token = saveTokens(instruccion);
	if (token.length < 1){
		console.log("La entrada no es parte de la sintaxis.");
		return "";
	}
	else{
		var salida = showTokens(token);
		return salida;
	}
}

var definiciones = {};
var functores = {};
/*La funcion visitarAST visita el AST para crear los predicados en los diccionarios
 * definiciones y functores dependiendo de lo que sea.
 */
function visitarAST(AST,entrada){
	
	if (AST.ast.start.kind == "estructura_1"){
		if (AST.ast.start.f != undefined && AST.ast.start.f.b !=undefined && AST.ast.start.f.b.length > 0){
			console.log("functor");
			if (AST.ast.start.atomo.value in definiciones){
				functores[AST.ast.start.atomo.value] = functores[AST.ast.start.atomo.value].concat(AST);	
			}
			else{
				functores[AST.ast.start.atomo.value] = [AST];
			}
			console.log("Se definio la regla '"+entrada+"'");
			//es functor
		}
		else{
			if (AST.ast.start.atomo.value in definiciones){
				definiciones[AST.ast.start.atomo.value]  = definiciones[AST.ast.start.atomo.value].concat(AST);	
			}
			else{
				definiciones[AST.ast.start.atomo.value] = [AST];
			}
			console.log("Se definio el hecho '"+entrada+"'");
		}
	}
	if (AST.ast.start.kind == "estructura_2"){
		console.log(AST.ast);
	}
	if (AST.ast.start.kind == "estructura_3"){
		console.log(AST.ast);
	}
}
/*La funcion interpretar interpreta la entrada para crear el predicado
 * */
function interpretar(entrada : string,input : string){
	var inter = interprete(entrada);
	try {
		visitarAST(inter,input);
	}
	catch (e) {
		console.log("Error: La entrada no forma parte de la sintaxis");
	}
}

class Arbol {
  public hijos = [];

  public constructor(public nodo: string) {}
  
  public agregarHijo(hijo : Arbol) {
	this.hijos.push(hijo);
  }
  public nodoActual(): string {
    return this.nodo;
  }
  public toString() {
	console.log("NODO ");
	console.log(this.nodo);
    for (var hijo of this.hijos){
		hijo.toString();
	}
  }
}
/*La funcion conseguirValores toma una estructura y la convierte en un arbol
 * */
function conseguirValores(estructura) : Arbol{
	if (estructura.entradas != undefined && estructura.entradas.e != undefined && estructura.entradas.e.kind == "estructura_1"){
		var a : Arbol;
		var b : Arbol;
		var arbol = new Arbol(estructura.atomo.value);
		if (estructura.entradas != undefined && estructura.entradas.e != undefined){
			a = conseguirValores(estructura.entradas.e);	
		}
		arbol.agregarHijo(a);
		if (estructura.entradas.b.length > 0){ //Varias entradas si existen pueden ser estructuras
			for (var i = 0; i < estructura.entradas.b.length; i++) {
				b = (conseguirValores(estructura.entradas.b[i]));
				arbol.agregarHijo(b);
			}
		}
		return arbol;
		//hay una estructura en la entrada
	}
	else if (estructura.f != undefined && estructura.f.b !=undefined && estructura.f.b.length > 0){
		var a1 = conseguirValores(estructura.entradas.e);
		var b1 : Arbol;
		var arbol2 = new Arbol(estructura.atomo.value);
		if (estructura.entradas != undefined && estructura.entradas.e != undefined){
			a1 = conseguirValores(estructura.entradas.e);	
		}
		arbol2.agregarHijo(a1);
		if (estructura.entradas.b.length > 0){
			for (var i = 0; i < estructura.entradas.b.length; i++) {
				b1 = conseguirValores(estructura.entradas.b[i].e);
				arbol2.agregarHijo(b1);
			}
		}
		var arbol3 = new Arbol("def");
		var c : Arbol;
		for (var i = 0; i < estructura.f.b.length; i++) {
			c = conseguirValores(estructura.f.b[i].e);
			arbol3.agregarHijo(c);
		}
		arbol2.agregarHijo(arbol3);
		return arbol2;
		//functores
	}
	else if (estructura.entradas != undefined && estructura.entradas.b != undefined && estructura.entradas.b.length > 0){
		var arbol4 = new Arbol(estructura.atomo.value);
		var a2 = conseguirValores(estructura.entradas.e); //Varias entradas
		arbol4.agregarHijo(a2);
		var b2 : Arbol;
		for (var i = 0; i < estructura.entradas.b.length; i++) {
			if (estructura.entradas.b[i].e != undefined){
				//console.log(estructura.entradas.b[i].e);
				b2 = conseguirValores(estructura.entradas.b[i].e);	
				arbol4.agregarHijo(b2);
			}
		}
		return arbol4;
	}
	else{
		if (estructura.kind == "TkVariable" || estructura.kind =="TkAtomo"){
			return (new Arbol(estructura.value));
		}
		if (estructura.entradas != undefined && estructura.entradas.e != undefined){
			var arbol5 : Arbol = new Arbol(estructura.atomo.value);
			arbol5.agregarHijo(estructura.entradas.e.value);
			return arbol5;
		}
		if (estructura.atomo != undefined){
			return (new Arbol(estructura.atomo.value));
		}
		if (estructura.value != undefined){
			return (new Arbol(estructura.value));
		}
	}
}
/*La funcion unificarFunctor deberia unificar el functor pero no esta completada
 * */
function unificarFunctor(functor : Arbol, entrada: Arbol){
	if (functor.nodoActual() == entrada.nodoActual()){
		if (functor.hijos.length-1 == entrada.hijos.length){
			for (var i = 0; i < entrada.hijos.length; i++) {
				if (functor.hijos[i].indexOf("TkAtomo") != -1 && entrada.hijos[i].indexOf("TkAtomo") != -1){
					unificarFunctor(functor.hijos[i],entrada.hijos[i]);
				}
				else if (functor.hijos[i].indexOf("TkVariable") != -1 && entrada.hijos[i].indexOf("TkVariable") != -1){
					console.log("Son ambos variables");
				}
				else if (functor.hijos[i].indexOf("TkVariable") != -1 && entrada.hijos[i].indexOf("TkAtomo") != -1){
					console.log("Se nombra la variable");
				}
			}
		}
		else{
			console.log("Nda");
		}
	}
}
/*La funcion unificarAtomos unifica atomos sin variables, solo puede verificar hechos predefinidos
 * */
function unificarAtomos(regla : Arbol, entrada: Arbol) : boolean {
	var valido = true;
	if (regla.hijos.length == entrada.hijos.length){
		for (var i = 0; i < entrada.hijos.length; i++) {
			if (regla.hijos[i].nodo == entrada.hijos[i].nodo){
				valido = valido && true;
			}
			else{
				valido = valido && false;
			}
		}
	}
	return valido;
}

/*La funcion consultarAST verifica si un predicado es hecho o functor y 
 * en caso de ser un hecho sin variables lo verifica, aun no puede trabajar 
 * con hechos que contienen variables y los functores no se pueden consultar.
 * */
function consultarAST(AST){
	if (AST.ast.start.kind == "estructura_1"){
		if (AST.ast.start.atomo.value in functores){
			console.log("No trabaja con functores");
			/*
			var lista = conseguirValores(AST.ast.start);
			console.log(lista);
			var copyFun = {};
			Object.assign(copyFun, functores);
			var definicionFunctor = copyFun[AST.ast.start.atomo.value];
			var def = [];
			for (var i = 0; i < copyFun[AST.ast.start.atomo.value].length; i++) {
				def.push(conseguirValores(copyFun[AST.ast.start.atomo.value][i].ast.start));
			}
			console.log(def);
			for (var m = 0; m < def.length; m++){
				def[m].toString();
			}*/
		}
		else{
			//hecho
			var co = conseguirValores(AST.ast.start);
			var copyHecho = {};
			Object.assign(copyHecho, definiciones);
			var hechos = copyHecho[AST.ast.start.atomo.value];
			var def2 =[];
			for (var i = 0; i < copyHecho[AST.ast.start.atomo.value].length; i++) {
				def2.push(conseguirValores(copyHecho[AST.ast.start.atomo.value][i].ast.start));
			}
			var valido : boolean = false;
			for (var m = 0; m < def2.length; m++){
				var res = unificarAtomos(def2[m],co);
				if (res == true){
					valido = true;
					break;
				}
			}
			if (valido == true){
				console.log("Satisfacible");
			}
			else{
				console.log("No satisfacible");
			}
		}
	}
	
}
/*La funcion consultar se llama con ASK y consulta un predicado.
 * */
function consultar(tokens : string){
	var inter = interprete(tokens);
	try {
		consultarAST(inter);
	}
	catch (e) {
		console.log("Error: La entrada no forma parte de la sintaxis");
	}
}
/*La funcion line maneja las entradas por consola y llama a las funciones necesarias dependiendo
 * de la entrada.
 * */
function line(rl){
  rl.question('~', entrada => {
    var re = /SALIR/gi;
    var re1 = /DEF/gi;
    var re2 = /ASK/gi;
    if (entrada.search(re) == 0){
      rl.input.destroy();
      console.log("Termino el programa");
    }
    if (entrada.search(re1) == 0){
      var instruccion = entrada.replace(re1,"");
      var tokens = lexear(instruccion);
      interpretar(tokens,instruccion);
      line(rl);
    }
    if (entrada.search(re2) == 0){
      var instruccion2 = entrada.replace(re2,"");
      var tokens = lexear(instruccion2);
      consultar(tokens);
      line(rl);
    }
    if (entrada.search(re) != 0 && entrada.search(re1) != 0 && entrada.search(re2) != 0){
      console.log("La entrada es incorrecta");
      line(rl);
    }
  });
}
/*La funcion main crear una interfaz para detectar las entradas por consola.
 * */
function main(){
	var funciona = true;
  let rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});
	line(rl);
}
main();

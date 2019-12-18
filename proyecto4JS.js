//crea el elemento canvas
var myCanvas = document.createElement("canvas");

//ajusta el ancho y altura del canvas
myCanvas.width = 100;
myCanvas.height = 100;

//obtiene el contexto de dibujo en 2 dimensiones
var ctx = myCanvas.getContext("2d");
//primero "limpiamos" el canvas
ctx.clearRect(0, 0, 100, 100);
//creamos y preparamos el array con la paleta de colores
var peachPalette = ["#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFC0CB"];

//crea cuadrados de 10x10
for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
        //indica cuando empezar a dibujar un cuadrado
        ctx.beginPath();
        ctx.rect(10 * j, 10 * i, 10, 10);

        //elige un color aleatorio de la paleta
        var randomColorIndex =
            Math.round(Math.random() * (peachPalette.length - 1));
        ctx.fillStyle = peachPalette[randomColorIndex];

        //rellena el cuadrado con el color seleccionado
        ctx.fill();

        //traza un borde blanco para el cuadrado
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        //indica cuando acabo de dibujar el cuadrado
        ctx.closePath();
    }
}

//esta funcion se ejecutara cuando acabe de cargar el documento
function setDynamicBackground() {
    //genera una imagen a partir del canvas
    var imageDataURL = myCanvas.toDataURL();

    //pone la imagen dinamica como fondo
    document.body.style.background =
        "transparent url('" + imageDataURL + "') repeat";
}

/**
 * Funcion que carga el video subido y lo muestra en la pagina. Antes de hacerlo, la funcion hace de filtro y no deja
 * que se suban los archivos que no tengan los formatos especificados.
 *
 * @param fInput: variable que almacenara el nombre del archivo que cargue el usuario
 */
function previewFile(fInput) {
    //devuelven el primer elemento que coincida con el grupo especificado de selectores
    let preview = document.querySelector('video');
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader(); //crea un nuevo objeto fileReader
    let allowed = ["mp4", "webm", "ogg"]; //array con los formatos permitidos
    let found = false; //boolean para comprobar si los formatos coinciden o no
    let span = document.createElement("span"); //crea el elemento <span>
    let table = document.getElementById("table"); //variable que contiene el elemento "table" del html
    let video = document.getElementById("video"); //variable que contiene el elemento "video" del html
    let info = document.getElementById("info"); //variable que contiene el elemento "video" del html

    //mientras este cargando el archivo, se ejecuta la siguiente funcion
    reader.onloadstart = function () {
        span.innerHTML = "<img src=\"giphy.gif\" alt='Imagen de carga'/>"; //agrega la cadena al html del elemento <span>
        info.innerHTML = "<h3>Cargando vídeo...</h3>"; //agrega la cadena al html del elemento "info"
        document.body.insertBefore(span, video); //inserta la etiqueta <span> antes de la etiqueta <video>
        //hace visibles los elementos (imagen de carga y texto de informacion)
        span.style.display = 'block';
        info.style.display = 'block';
        //oculta los elementos (video y botones)
        video.style.display = 'none';
        table.style.display = 'none';
    };

    //cuando acabe de cargar el archivo, se ejecuta la siguiente funcion
    reader.onloadend = function () {
        //oculta los elementos (imagen de carga y texto de informacion)
        span.style.display = 'none';
        info.style.display = 'none';
        //hace visibles los elementos (video y botones)
        video.style.display = 'block';
        table.style.display = 'block';
        //muestra el video cargado y almacenado en el reader
        preview.src = reader.result;
    };

    //bucle que recorre el array de formatos permitidos
    allowed.forEach(function (extension) {
        //si el archivo coincide con alguno de los formatos permitidos...
        if (file.type.match('video/' + extension)) {
            found = true; //se cumple la condicion, por lo que el boolean pasa a ser true
        }
    });

    //si el boolean es true...
    if (found) {
        reader.readAsDataURL(file); //una vez cargado el archivo, lee la informacion contenida en este

        //se crean los botones del video, para reproducirlo, pausarlo...
        document.getElementsByTagName("a")[0].innerHTML = "<button onclick='document.getElementById(\"video\").play();'>Reproducir</button>";
        document.getElementsByTagName("a")[1].innerHTML = "<button onclick='document.getElementById(\"video\").pause();'>Pausa</button>";
        document.getElementsByTagName("a")[2].innerHTML = "<button onclick='stop()'>Detener</button>";
        document.getElementsByTagName("a")[3].innerHTML = "<button onclick='document.getElementById(\"video\").volume += 0.1;'>Subir volumen</button>";
        document.getElementsByTagName("a")[4].innerHTML = "<button onclick='document.getElementById(\"video\").volume -= 0.1;'>Bajar volumen</button>";

        //bucle que recorre los botones y los va haciendo visibles (puede parecer redundante ya que se hace lo mismo con la tabla donde estan metidos los botones,
        // pero si el usuario quiere ir alternando entre varios videos, al cambiar los botones o al subir un archivo erroneo, estos desaparecerian sin este bucle)
        for (let i = 0; i <= document.getElementsByTagName("a").length; i++) {
            document.getElementsByTagName("a")[i].style.display = 'block';
        }

    } else { //si es false...
        //ventana que lanza el mensaje de error
        window.alert("Formato no válido, solo se pueden subir vídeos en formato MP4, WEBM u OGV.");
        preview.src = ""; //deja en blanco la vista previa
        fInput.value = ""; //deja en blanco el nombre del archivo erroneo que se ve al cargar dicho archivo.

        //bucle que recorre los botones y los va ocultando
        for (let i = 0; i <= document.getElementsByTagName("a").length; i++) {
            document.getElementsByTagName("a")[i].style.display = 'none';
        }
    }
}

/**
 * Funcion que detiene el video
 */
function stop() {
    let vid = document.getElementById("video"); //variable que almacena el elemento video
    vid.currentTime = 0; //posiciona la reproduccion al principio
    vid.pause(); //pausa el video
}
<template>
    <div class="login page" v-if="this.nick == ''">
        <div class="form">
            <h3 class="title">Introduce un nick</h3>
            <input class="usernameInput" v-model="nickModel" v-on:keyup.13="anadirNick" type="text" maxlength="14" />
        </div>
    </div>
    <div id="nota" v-else>
            <div class="input-group mb-3">
                <input class="form-control" id="tarea" placeholder="    ¿Qué quieres recordar?" v-model="tareaModel" type="text" name="tarea" v-on:keyup.13="nuevaNota">
            </div>
            <div id="contadoresTareas">
                <hr>
                <i class='fas fa-chart-bar'></i>{{notasPendientes()}} Tareas pendientes de un total de {{notas.length}} | <i class="glyphicon glyphicon-remove" v-on:click="borrarCompletadas"></i><span v-on:click="borrarCompletadas" id="borrarCompletadas">Borras tareas completadas</span>
                <hr>
            </div>
            <div>
                <ul class="list-group">
                    <transition-group name="fade">
                    <li class="list-group-item li" v-for="nota in ordenar" :key="nota.tituloTarea">
                        <div class="d-flex bd-highlight mb-3">
                            <span class="check" v-if="nota.completada"><img class="imagenEstado" src="../../public/siTerminada.png" v-on:click="modoIncompleta(nota)"></span>
                            <span class="check" v-else><img class="imagenEstado" src="../../public/noTerminada.png" v-on:click="modoCompleta(nota)"></span>
                            <h1 v-if="nota.completada" class="p-2 bd-highlight textoTareaCompletada">{{ nota.tituloTarea }}</h1>
                            <h1 v-else class="p-2 bd-highlight ">{{ nota.tituloTarea }}</h1>

                            <img id="botonBorrar" class="ml-auto" src="../../public/borrar.png" v-on:click="borrarNota(nota)">
                        </div>
                        <div class="text-secondary">Prioridad:
                            <button class="btn btn-info btn-sm prioridad" v-if="nota.prioridad == 'Low'" type="button" ><i class="fas fa-angle-down"></i>Low
                            </button>
                            <button class="btn btn-secondary btn-sm prioridad" v-else v-on:click="prioridadLow(nota)" type="button"><i class="fas fa-angle-down"></i>Low
                            </button>
                            <button class="btn btn-primary btn-sm prioridad" v-if="nota.prioridad == 'Normal'" type="button" >Normal
                            </button>
                            <button class="btn btn-secondary btn-sm prioridad" v-else v-on:click="prioridadNormal(nota)" type="button">Normal
                            </button>
                            <button class="btn btn-danger btn-sm prioridad" v-if="nota.prioridad == 'High'" type="button"><i class="fas fa-angle-up"></i>High
                            </button>
                            <button class="btn btn-secondary btn-sm prioridad" v-else v-on:click="prioridadHigh(nota)" type="button"><i class="fas fa-angle-up"></i>High
                            </button>
                            <span id="spanTiempo"><i class="fas far fa-clock"></i> Añadido hace {{ nota.fechaCreacion }} minutos |</span>
                            <span> Creado por {{nota.nick}}</span>
                            <div class="subirArchivo">
                                <input type="file" @change="onFileSelected"/>
                                <button @click="onUpload">Subir</button>
                            </div>
                        </div>
                    </li>
                    </transition-group>
                </ul>
            </div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.6.3/css/all.css' integrity='sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/' crossorigin='anonymous'>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "Section",
        data: function(){
            return {
                notas: [],
                tareaModel: "",
                tareaPrioridad: [],
                nickModel:"",
                nick:"",
                selectedFile: null,
            }
        },
        methods:{
            nuevaNota: function(){
                var tituloTarea = this.tareaModel;
                var fechaCreacion = new Date().toLocaleString();
                var prioridad = "Low";
                var completada = false;
                var nick = this.nick;
                var selectedFile = this.selectedFile;
                this.notas.push({tituloTarea, fechaCreacion, prioridad, completada, nick, selectedFile});
                this.tareaModel="";
                this.$socket.emit('subirNotas', JSON.stringify(this.notas));
                this.$socket.emit('nuevaNotaServidor');
            },
            anadirNick: function(){
                this.nick = this.nickModel;
                this.$socket.emit('usuarioOn');
            },
            onFileSelected(event){
                this.selectedFile = event.target.files[0];
            },
            onUpload(){
                const fd = new FormData();
                fd.append('archivo',this.selectedFile, this.selectedFile.name);

                axios.post('http://localhost:3000/archivosSubidos',fd)
                    .then(res=> {
                        console.log(res)
                    })
            },
            borrarNota: function(nota){
                var notas = this.notas;
                for(let i = 0; i < notas.length; i++){
                    if(notas[i] == nota){
                        notas.splice(i,1);
                    }
                }
                this.$socket.emit('subirNotas', JSON.stringify(this.notas));
                this.$socket.emit('borrarNotaServidor');
            },
            modoCompleta: function(nota){
                nota.completada = true;
                this.$socket.emit('subirNotas', JSON.stringify(this.notas));
            },
            modoIncompleta: function(nota){
                nota.completada = false;
                this.$socket.emit('subirNotas', JSON.stringify(this.notas));
            },
            notasPendientes: function(){
                var contador = 0;
                for(let i=0; i<this.notas.length; i++){
                    if(this.notas[i].completada == false){
                        contador++;
                    }
                }
                return contador;
            },
            prioridadLow: function(nota){
                nota.prioridad = "Low";
                this.$socket.emit('subirNotas', JSON.stringify(this.notas));
            },
            prioridadNormal: function(nota){
                nota.prioridad = "Normal";
                this.$socket.emit('subirNotas', JSON.stringify(this.notas));
            },
            prioridadHigh: function(nota){
                nota.prioridad = "High";
                this.$socket.emit('subirNotas', JSON.stringify(this.notas));
            },
            borrarCompletadas: function(){
                for(let i = 0; i < this.notas.length; i++){
                    if(this.notas[i].completada == true){
                        this.notas.splice(i,1);
                    }
                }
                this.$socket.emit('subirNotas', JSON.stringify(this.notas));
            }
        },
        computed: {
            ordenar: function(){
                this.arrayOrdenado = [];
                for(let i=0; i<this.notas.length; i++){
                    if(this.notas[i].prioridad == "High"){
                        this.arrayOrdenado.push(this.notas[i]);
                    }
                }
                for(let i=0; i<this.notas.length; i++){
                    if(this.notas[i].prioridad == "Normal"){
                        this.arrayOrdenado.push(this.notas[i]);
                    }
                }
                for(let i=0; i<this.notas.length; i++){
                    if(this.notas[i].prioridad == "Low"){
                        this.arrayOrdenado.push(this.notas[i]);
                    }
                }
                return this.arrayOrdenado;
            }
        },
        sockets:{
            cargarNotas: function (listaNotas) {
                this.notas= JSON.parse(listaNotas);
            },
            subirNotas: function () {
                var listaParaSubir = JSON.parse(this.notas);
                socket.emit('actualizando', listaParaSubir);
            },
            usuarioOn: function(){
                this.$notify({
                    group: 'foo',
                    title: 'Usuario conectado',
                    text: 'Un usuario se ha conectado'
                });
            },
            usuarioOff: function(){
                this.$notify({
                    group: 'foo',
                    title: 'Usuario desconectado',
                    text: 'Un usuario se ha desconectado'
                });
            },
            nuevaNotaServidor: function(){
                this.$notify({
                    group: 'foo',
                    title: 'Nueva nota creada',
                    text: 'Se ha creado una nueva nota',
                });
            },
            borrarNotaServidor: function(){
                this.$notify({
                    group: 'foo',
                    title: 'Una nota ha sido borrada',
                    text: 'Un usuario ha eliminado una nota'
                });
            },
        }
    }
</script>

<style scoped>
    #contadoresTareas{
        color: white;
    }
    hr{
        background: #3D3D3D;
    }
    #tarea{
        width: 100%;
        height: 55px;
    }
    #borrarCompletadas{
        color: #E89613;
    }
    .glyphicon{
        color: #E89613;
        margin-right: 3px;
        margin-left: 3px;
    }
    .fas{
        margin-right: 3px;
    }
    .li{
        padding-left: 40px;
        background: #303030;
        color:white;
        border-color: #3D3D3D;
    }
    .prioridad{
        margin-right: 3px;
    }
    .check{
        padding-top: 10px;
        padding-right: 15px;
    }
    .imagenEstado{
        height: 40px;
    }
    #spanTiempo{
        margin-left: 15px;
    }
    #botonBorrar{
        width: 60px;
        height: 60px;
    }
    .textoTareaCompletada{
        color: #12B188;
        text-decoration: line-through;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .8s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    .login.page {
        background-color: #000;
    }

    .login.page .form {
        height: 100px;
        margin-top: -100px;
        position: absolute;

        text-align: center;
        top: 50%;
        width: 100%;
    }

    .login.page .form .usernameInput {
        background-color: transparent;
        border: none;
        border-bottom: 2px solid #fff;
        outline: none;
        padding-bottom: 15px;
        text-align: center;
        width: 400px;
    }

    .login.page .title {
        font-size: 200%;
    }

    .login.page .usernameInput {
        font-size: 200%;
        letter-spacing: 3px;
    }

    .login.page .title, .login.page .usernameInput {
        color: #fff;
        font-weight: 100;
    }
    .subirArchivo{
        padding-top: 5px;
    }
</style>
<script>
import {IonPage, IonContent, IonInput, IonButton} from '@ionic/vue'
import { inject } from 'vue';
import { storeToRefs } from "pinia";
import { loginStore } from "../stores/userStore"

export default {
  components: {IonPage, IonContent, IonInput, IonButton},

  setup() {
    // Accede a 'user' proporcionado desde el componente 'LoginView'
    const user = inject('user', null);
    const store = loginStore();
    const { idLogeado, estaLogeado, esAdmin, esAlumno } = storeToRefs(store);
    return { idLogeado,esAdmin, estaLogeado,esAlumno};
  },
  data() {
    return {
      gym: { cantidadAhora: 0},
      user: { estaEnElgym: false}
    }
  },
  methods:{
    agregarCantidad(){
      if(user.estaEnElGym == false){
        console.log("Correcto")
        gym.cantidadAhora++
      }

    },
    disminuirCantidad(){

    }


  }


}
</script>


<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-row justify-content-center align-items-center class="ion-text-center">
        <ion-col size="12">
          <h1>Bienvenido al Gimnasio Fitness</h1>
          <h1>Gym Zuma Fit</h1>
         <!--  <h2>Cantidad de alumnos en el gym </h2> {{ this.gym.cantidadAhora }}
          <div v-if="estaLogeado && esAdmin">
            <h1> Agregar limite del gym</h1>
          <ion-input class="input" v-model="gym.limite" placeholder="Limite de personas" type="number"></ion-input>
          <ion-button @click="loginForm">Agregar</ion-button>
          </div>
          <div v-if="estaLogeado && esAlumno">
            <h1 v-if="user.estaEnElgym">Estoy en el gym</h1>
            <h1 v-else>No estoy en el gym</h1>
            <ion-button @click="agregarCantidad">Estoy en el gym</ion-button>
            <ion-button @click="disminuirCantidad">Me fui del gym</ion-button>
          </div>
           -->
         
        </ion-col>
      </ion-row>

      <ion-row justify-content-center align-items-center class="ion-text-center mt-4">
        <ion-col size="12">
          <ion-img src="https://www.sellingmybusiness.co.uk/images/1920x400/0x0-0x0/selling-a-business/gym-banner.jpg"></ion-img>
        </ion-col>
      </ion-row>

      <ion-row class="mt-4">
        <ion-col size="12">
          <h2><strong>Nuestro Gimnasio</strong></h2>
          <p>
            En nuestro gimnasio, nos dedicamos a proporcionar un ambiente motivador
            y saludable para alcanzar tus objetivos de fitness. Contamos con instalaciones
            modernas, equipos de última generación y entrenadores calificados que te ayudarán
            en cada paso de tu viaje fitness.
          </p>
        </ion-col>
      </ion-row>

      <ion-row class="ion-justify-content-around mt-4">
        <ion-col size="12" size-md="4">
          <h3><strong>Equipamiento Moderno</strong></h3>
          <p>Nuestro gimnasio está equipado con lo último en tecnología fitness para brindarte la mejor experiencia de
            entrenamiento.</p>
        </ion-col>
        <ion-col size="12" size-md="4">
          <h3><strong>Clases Variadas</strong></h3>
          <p>Ofrecemos una variedad de clases, desde yoga hasta entrenamiento de alta intensidad, para satisfacer tus
            preferencias y metas.</p>
        </ion-col>
        <ion-col size="12" size-md="4">
          <h3><strong>Entrenadores Expertos</strong></h3>
          <p>Nuestro equipo de entrenadores altamente calificados está aquí para guiarte y motivarte en tu viaje hacia un
            estilo de vida más saludable.</p>
        </ion-col>
      </ion-row>

      <ion-row justify-content-center align-items-center class="ion-text-center mt-4">
        <ion-col size="12">
          <ion-img src="https://cdn.kingsbox.com/assets/media/landing-categories/home-gym-1627327264-2.jpg"></ion-img>
        </ion-col>
      </ion-row>

      <ion-row justify-content-center align-items-center class="ion-text-center mt-4">
          <ion-col size="12">
            <div>
              <router-link to="/login">
                <ion-button expand="full" size="large">¡Comienza tu Viaje Fitness Ahora!</ion-button>
              </router-link>
            </div>
          </ion-col>
        </ion-row>

    </ion-content>

  </ion-page>
</template>


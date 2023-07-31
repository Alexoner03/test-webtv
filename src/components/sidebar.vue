<template>
  <va-sidebar v-model="show" textColor="dark" minimizedWidth="0" position="right" style="position: absolute" width="350px">
    <template v-if="page === 'home'">
      <va-sidebar-item>
        <va-sidebar-item-content>
          <p style="margin-left: 1rem; font-size: 1.3rem" class="title">Mi cuenta</p>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item
          v-for="item in items"
          :key="item.title"
          @click="getAction(item.action)"
      >
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" :name="item.icon" />
          <va-sidebar-item-title>
            {{ item.title }}
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'profile'">
      <va-sidebar-item @click="page = 'home'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back" />
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Perfil</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item>
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem" class="title">Usuario</p>
            <p style="margin-left: 1rem">{{profileInfo.name}}</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item>
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem" class="title">Correo electrónico</p>
            <p style="margin-left: 1rem">{{profileInfo.email}}</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'plan'">
      <va-sidebar-item @click="page = 'home'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back" />
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Mi Plan</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item>
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem" class="title">Plan Asociado</p>
            <p style="margin-left: 1rem">{{planInfo.associatedPlan}}</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <!-- <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem" class="title mb-2">Vigencia</p>
            <p style="margin-left: 1rem">Desde {{planInfo.vigency.from}}</p>
            <p style="margin-left: 1rem">Hasta {{planInfo.vigency.to}}</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item> -->
      <va-sidebar-item @click="getAction('soon')"><!-- page = 'other_plans' -->
        <va-sidebar-item-content>
          <va-icon style="margin-left: 1rem" name="dvr" />
          <va-sidebar-item-title>
            Otros planes
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item style="max-width: 350px">
        <va-sidebar-item-content>
          <va-sidebar-item-title style="max-width: 80%">
            <p style="margin-left: 1rem; white-space: normal; word-break: normal">
              Para contratar algún Plan, favor contactar a:<br><br> {{ correo }}
            </p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'other_plans'">
      <va-sidebar-item @click="page = 'plan'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back" />
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Otros planes</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item v-for="plan in planInfo.other_plans" :key="plan.name">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem" class="title">{{ plan.name }}</p>
            <p style="margin-left: 1rem">{{plan.channelsCount}} canales</p>
            <p style="margin-left: 1rem">{{plan.deviceCount}} dispositivo reproduciendo</p>
            <p style="margin-left: 1rem">${{plan.amount}} x mes</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'change_password'">
      <va-sidebar-item @click="page = 'home'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back" />
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Cambiar contraseña</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item>
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem;white-space: normal; word-break: normal" class="mb-4">Le enviaremos un correo para que pueda cambiar su contraseña</p>
            <p style="margin-left: 1rem;white-space: normal; word-break: normal" class="mb-4">Favor ingrese el correo electrónico al cual está asociada esta cuenta</p>

            <div style="margin-left: 1rem;" class="mb-4">
              <va-input
                  v-model="emailAssociated"
                  class="mb-6"
                  placeholder="Ej: micorreo@correo.com"
              />
            </div>

            <div style="margin-left: 1rem;" class="mb-4">
              <va-button
                  size="large"
                  style="width: 100px"
                  color="secondary"
                  round
                  @click="getAction('submitChangePassword')"
              >
                Enviar
              </va-button>
            </div>

            <div v-if="touchChangePassword" style="margin-left: 1rem">
              <va-progress-circle indeterminate v-if="changingPassword"/>
              <div v-else>
                <div class="d-flex label_cp" style="align-items: center" >
                  <div>
                    <va-icon color="white" name="forward_to_inbox" size="2rem" class="mr-2"></va-icon>
                  </div>
                  <div>
                    <strong>!Correo enviado!</strong> <br>
                    Favor revise su bandeja de entrada
                  </div>
                </div>
              </div>
            </div>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'disable_account'">
      <va-sidebar-item @click="page = 'home'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back" />
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Desvincular cuenta</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item @click="page = 'autodisable'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 1rem; margin-left: 1rem" name="disabled_by_default" />
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem">Autodesvincularse</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item @click="page = 'disable_other'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 1rem; margin-left: 1rem" name="disabled_by_default" />
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem">Desvincular otro dispositivo</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'autodisable'">
      <va-sidebar-item @click="page = 'disable_account'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back" />
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Autodesvincularse</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="title mb-4">¿Desea desvincular este dispositivo de la cuenta?</p>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="mb-4">
              *Recuerde que si usted se desvincula, liberará un cupo para que otro dispositivo pueda vincularse a la cuenta.
            </p>
            <div>
              <div style="margin-left: 1rem;" class="mb-4">
                <va-button
                    size="large"
                    color="secondary"
                    style="width: 80px"
                    class="mr-4"
                    :loading="desasociando"
                    round
                    @click="getAction('disassociateAccount')"
                >
                  Si
                </va-button>

                <va-button
                    size="large"
                    style="width: 80px"
                    outline
                    color="white"
                    round
                    @click="page = 'disable_account'"
                >
                  No
                </va-button>
              </div>
            </div>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'disable_other'">
      <va-sidebar-item @click="page = 'disable_account'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back" />
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Desvincular otro dispositivo</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal; text-transform: unset" class="title mb-4">Si desea desvincular otro dispositivo debe solicitarlo al:</p>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="mb-4">
              Tel: {{ fono }} <br>
              {{ correo }}
            </p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'parental_control'">
      <va-sidebar-item @click="page = 'home'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back" />
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Control Parental</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal; text-transform: unset" class="title mb-4">Si desea obtener su código control parental, debe solicitarlo al:</p>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="mb-4">
              Tel: {{ fono }} <br>
              {{ correo }}
            </p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'logout'">
      <va-sidebar-item @click="page = 'home'">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back" />
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Cerrar sesión</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="title mb-4">¿Está seguro que desea cerrar sesión?</p>
            <div>
              <div style="margin-left: 1rem;" class="mb-4">
                <va-button
                    size="large"
                    color="secondary"
                    style="width: 80px"
                    class="mr-4"
                    round
                    @click="getAction('logoutConfirm')"
                >
                  Si
                </va-button>

                <va-button
                    size="large"
                    style="width: 80px"
                    outline
                    color="white"
                    round
                    @click="page = 'home'"
                >
                  No
                </va-button>
              </div>
            </div>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
  </va-sidebar>
</template>

<script setup>
  import useProfileService from "../services/profile.service"
  import loginService from '../services/login.service'
  import {reactive, ref} from "vue";
  import {useRouter} from "vue-router";

  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    fono: {
      type: String,
      default: "+56 9 123456789",
    },
    correo: {
      type: String,
      default: "support@company.net",
    },
    plan: {
      type: String,
      default: "Básico",
    },
  })

  const desasociando = ref(false);
  const profileService = useProfileService()
  const router = useRouter()
  const items = ref([])
  const page = ref("home")
  const emailAssociated = ref("")
  const changingPassword = ref(false)
  const touchChangePassword = ref(false) //verificando si no ha hecho nada
  const profileInfo = reactive({
    name: "",
    email: ""
  })

  const planInfo = reactive({
    associatedPlan: "",
    vigency: {
      from : "",
      to: ""
    },
    other_plans: []
  })

  profileService.getProfileMenu().then((_items) => {
    items.value = _items
  })

  profileService.getProfileInfo().then((_info) => {
    profileInfo.name = localStorage.user
    profileInfo.email = localStorage.mail
  })

  profileService.getPlanInfo().then((_info) => {
    planInfo.associatedPlan = props.plan
    planInfo.vigency = _info.vigency
    planInfo.other_plans = _info.other_plans
  })

  const getAction = (actionName) =>
  {
    const pages = [
      "profile",
      "plan",
      //"change_password",
      "disable_account",
      "parental_control",
      "logout",
    ]

    if(pages.includes(actionName))
    {
      page.value = actionName
      return
    }

    const actions = {
      async disassociateAccount(){
        desasociando.value = true;
        const reqData = new FormData();
        reqData.append("token", localStorage.token);
        const req = await fetch(process.env.VUE_APP_API_URL + 'api/desvincular', { method: 'POST', body: reqData, redirect: 'follow' }); 
        const res = await req.json();

        if(res.error){
          alert("Error al desvincular cuenta, inténtelo más tarde");
          desasociando.value = false;
        }
        else{
          this.logoutConfirm();
        }
      },
      logoutConfirm(){
        const {isLogged} = loginService();
        isLogged.value = false;
        localStorage.clear();
        router.replace({name: 'login'})
      },
      submitChangePassword(){
        touchChangePassword.value = true
        changingPassword.value = true
        profileService.changePassword(emailAssociated.value).then(() => changingPassword.value = false)
      },
      soon(){
        alert("Disponible en breve")
      }
    }

    actions[actionName] ? actions[actionName]() : null
  }

</script>

<style scoped>
.label_cp {
  background: #339a5c;
  padding: 1rem .3rem;
  border-radius: .5rem;
}
</style>
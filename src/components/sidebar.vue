<template>
  <va-sidebar v-model="props.show" textColor="dark" minimizedWidth="0" position="right"
              style="position: absolute; z-index: 1 !important;"
              width="350px">
    <template v-if="page === 'home'">
      <va-sidebar-item ref="home_back" @click="$emit('close')"
                       :class="[show ? '_selectable': '']"
                       @keydown.enter="$emit('close')"
      >
        <va-sidebar-item-content>
          <img class="icon" :src="require('@/assets/arrow_back.png')" alt="">
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item>
        <va-sidebar-item-content>
          <p style="margin-left: 1rem; font-size: 1.3rem" class="title">Mi cuenta</p>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item
          v-for="item in items"
          :key="item.title"
          @click="getAction(item.action)"
          :class="[show ? '_selectable': '']"
          :id="item.action + '_item'"
          @keydown.enter="getAction(item.action)"
      >
        <va-sidebar-item-content>
          <div class="icon_menu" v-if="item.icon === 'account_box'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                 class="bi bi-person-square" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path
                  d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
            </svg>
          </div>
          <div class="icon_menu" v-else-if="item.icon === 'dvr'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-grid"
                 viewBox="0 0 16 16">
              <path
                  d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
            </svg>
          </div>
          <div class="icon_menu" v-else-if="item.icon === 'disabled_by_default'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                 class="bi bi-x-square-fill" viewBox="0 0 16 16">
              <path
                  d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </div>
          <div class="icon_menu" v-else-if="item.icon === 'supervisor_account'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-people-fill"
                 viewBox="0 0 16 16">
              <path
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            </svg>
          </div>
          <div class="icon_menu" v-else-if="item.icon === 'logout'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                 class="bi bi-box-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
              <path fill-rule="evenodd"
                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
            </svg>
          </div>
          <va-icon v-else style="margin-right: 2rem; margin-left: 1rem" :name="item.icon"/>
          <va-sidebar-item-title>
            {{ item.title }}
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'profile'">
      <va-sidebar-item ref="profile_back" @click="backToHome"
                       :class="[show ? '_selectable': '']"
                       @keydown.enter="backToHome"
      >
        <va-sidebar-item-content>
          <img class="icon" :src="require('@/assets/arrow_back.png')" alt="">
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
            <p style="margin-left: 1rem">{{ profileInfo.name }}</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item>
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem" class="title">Correo electrónico</p>
            <p style="margin-left: 1rem">{{ profileInfo.email }}</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'plan'">
      <va-sidebar-item ref="plan_back" @click="backToHome" :class="[show ? '_selectable': '']"
                       @keydown.enter="backToHome">
        <va-sidebar-item-content>
          <img class="icon" :src="require('@/assets/arrow_back.png')" alt=""></va-sidebar-item-content>
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
            <p style="margin-left: 1rem">{{ planactual }}</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item @click="nextTo('other_plans')" :class="[show ? '_selectable': '']"
                       @keydown.enter="nextTo('other_plans')">
        <va-sidebar-item-content>
          <div style="margin-left: 1rem">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-grid"
                 viewBox="0 0 16 16">
              <path
                  d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
            </svg>
          </div>
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
      <va-sidebar-item ref="other_plans_back" @click="nextTo('plan')" :class="[show ? '_selectable': '']"
                       @keydown.enter="nextTo('plan')">
        <va-sidebar-item-content>
          <img class="icon" :src="require('@/assets/arrow_back.png')" alt=""></va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Otros planes</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item v-for="plan in planes" :key="plan.nombre">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem" class="title">{{ plan.nombre }}</p>
            <p style="margin-left: 1rem">{{ plan.cantidad_canales }} canales</p>
            <!-- <p style="margin-left: 1rem">{{plan.deviceCount}} dispositivo reproduciendo</p> -->
            <p style="margin-left: 1rem">{{ plan.precio }} x mes</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'change_password'">
      <va-sidebar-item ref="change_password_back" @click="backToHome" :class="[show ? '_selectable': '']"
                       @keydown.enter="backToHome">
        <va-sidebar-item-content>
          <va-icon style="margin-right: 2rem; margin-left: 1rem" name="arrow_back"/>
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
            <p style="margin-left: 1rem;white-space: normal; word-break: normal" class="mb-4">Le enviaremos un correo
              para que pueda cambiar su contraseña</p>
            <p style="margin-left: 1rem;white-space: normal; word-break: normal" class="mb-4">Favor ingrese el correo
              electrónico al cual está asociada esta cuenta</p>

            <div style="margin-left: 1rem;" class="mb-4">
              <va-input
                  v-model="emailAssociated"
                  class="mb-6"
                  :class="[show ? '_selectable': '']"
                  placeholder="Ej: micorreo@correo.com"
              />
            </div>

            <div style="margin-left: 1rem;" class="mb-4">
              <va-button
                  size="large"
                  :class="[show ? '_selectable': '']"
                  @keydown.enter="getAction('submitChangePassword')"
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
                <div class="d-flex label_cp" style="align-items: center">
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
      <va-sidebar-item ref="disable_account_back" @click="backToHome"
                       :class="[show ? '_selectable': '']"
                       @keydown.enter="backToHome"
      >
        <va-sidebar-item-content>
          <img class="icon" :src="require('@/assets/arrow_back.png')" alt=""></va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item class="mb-4">
        <va-sidebar-item-content>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1.5rem" class="title">Desvincular cuenta</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item @click="nextTo('autodisable')" :class="[show ? '_selectable': '']"
                       @keydown.enter="nextTo('autodisable')">
        <va-sidebar-item-content>
          <div style="margin-right: 1rem; margin-left: 1rem">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                 class="bi bi-x-square-fill" viewBox="0 0 16 16">
              <path
                  d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </div>
          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem">Autodesvincularse</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item @click="nextTo('disable_other')" :class="[show ? '_selectable': '']"
                       @keydown.enter="nextTo('disable_other')">
        <va-sidebar-item-content>
          <div style="margin-right: 1rem; margin-left: 1rem">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                 class="bi bi-x-square-fill" viewBox="0 0 16 16">
              <path
                  d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </div>          <va-sidebar-item-title>
            <p style="margin-left: 1rem; font-size: 1rem">Desvincular otro dispositivo</p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'autodisable'">
      <va-sidebar-item ref="autodisable_back" @click="nextTo('disable_account')" :class="[show ? '_selectable': '']"
                       @keydown.enter="nextTo('disable_account')">
        <va-sidebar-item-content>
          <img class="icon" :src="require('@/assets/arrow_back.png')" alt=""></va-sidebar-item-content>
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
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="title mb-4">
              ¿Desea desvincular este dispositivo de la cuenta?</p>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="mb-4">
              *Recuerde que si usted se desvincula, liberará un cupo para que otro dispositivo pueda vincularse a la
              cuenta.
            </p>
            <div>
              <div style="margin-left: 1rem;" class="mb-4">
                <va-button
                    size="large"
                    color="secondary"
                    style="width: 80px"
                    class="mr-4"
                    :class="[show ? '_selectable': '']"
                    @keydown.enter="getAction('disassociateAccount')"
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
                    :class="[show ? '_selectable': '']"
                    @keydown.enter="nextTo('disable_account')"
                    @click="nextTo('disable_account')"
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
      <va-sidebar-item ref="disable_other_back" @click="nextTo('disable_account')" :class="[show ? '_selectable': '']"
                       @keydown.enter="nextTo('disable_account')">
        <va-sidebar-item-content>
          <img class="icon" :src="require('@/assets/arrow_back.png')" alt=""></va-sidebar-item-content>
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
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal; text-transform: unset"
               class="title mb-4">Si desea desvincular otro dispositivo debe solicitarlo al:</p>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="mb-4">
              Tel: {{ fono }} <br>
              {{ correo }}
            </p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'parental_control'">
      <va-sidebar-item ref="parental_control_back" @click="backToHome" :class="[show ? '_selectable': '']"
                       @keydown.enter="backToHome">
        <va-sidebar-item-content>
          <img class="icon" :src="require('@/assets/arrow_back.png')" alt=""></va-sidebar-item-content>
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
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal; text-transform: unset"
               class="title mb-4">Si desea obtener su código control parental, debe solicitarlo al:</p>
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="mb-4">
              Tel: {{ fono }} <br>
              {{ correo }}
            </p>
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
    </template>
    <template v-else-if="page === 'logout'">
      <va-sidebar-item ref="logout_back" @click="backToHome" :class="[show ? '_selectable': '']"
                       @keydown.enter="backToHome">
        <va-sidebar-item-content>
          <img class="icon" :src="require('@/assets/arrow_back.png')" alt=""></va-sidebar-item-content>
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
            <p style="margin-left: 1rem; font-size: 1rem; white-space: normal; word-break: normal" class="title mb-4">
              ¿Está seguro que desea cerrar sesión?</p>
            <div>
              <div style="margin-left: 1rem;" class="mb-4">
                <va-button
                    size="large"
                    color="secondary"
                    style="width: 80px"
                    class="mr-4"
                    round
                    :class="[show ? '_selectable': '']"
                    @keydown.enter="getAction('logoutConfirm')"
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
                    :class="[show ? '_selectable': '']"
                    @keydown.enter="backToHome"
                    @click="backToHome"
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
import {nextTick, reactive, ref} from "vue";
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
  planes: {
    type: Array,
    default: []
  },
  planactual: {
    type: String,
    default: 'Básico'
  }
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

/**
 * template refs
 */

const profile_back = ref(null)
const home_back = ref(null)
const plan_back = ref(null)
const other_plans_back = ref(null)
const change_password_back = ref(null)
const disable_account_back = ref(null)
const autodisable_back = ref(null)
const disable_other_back = ref(null)
const parental_control_back = ref(null)
const logout_back = ref(null)
const profile = ref(null)

/**
 * end template refs
 */
profileService.getProfileMenu().then((_items) => {
  items.value = _items
})

profileService.getProfileInfo().then((_info) => {
  profileInfo.name = localStorage.user
  profileInfo.email = localStorage.mail
})

const backToHome = () => {
  page.value = 'home'
  nextTick(() => {
    home_back.value.$el.focus()
  })
}

const nextTo = (_page) => {
  page.value = _page
  nextTick(() => {
    switch (_page) {
      case 'profile':
        profile_back.value.$el.focus();
        break;
      case 'plan':
        plan_back.value.$el.focus();
        break;
      case 'other_plans':
        other_plans_back.value.$el.focus();
        break;
      case 'change_password':
        change_password_back.value.$el.focus();
        break;
      case 'disable_account':
        disable_account_back.value.$el.focus();
        break;
      case 'autodisable':
        autodisable_back.value.$el.focus();
        break;
      case 'disable_other':
        disable_other_back.value.$el.focus();
        break;
    }
  })
}

const getAction = (actionName, params = null) => {
  const pages = [
    "profile",
    "plan",
    //"change_password",
    "disable_account",
    "parental_control",
    "logout",
  ]

  if (pages.includes(actionName)) {
    page.value = actionName

    nextTick(() => {
      switch (actionName) {
        case 'profile':
          profile_back.value.$el.focus();
          break;
        case 'plan':
          plan_back.value.$el.focus();
          break;
        case 'disable_account':
          disable_account_back.value.$el.focus();
          break;
        case 'parental_control':
          parental_control_back.value.$el.focus();
          break;
        case 'logout':
          logout_back.value.$el.focus();
          break;
      }
    })

    return
  }

  const actions = {
    async disassociateAccount() {
      desasociando.value = true;
      const reqData = new FormData();
      reqData.append("token", localStorage.token);
      const req = await fetch(process.env.VUE_APP_API_URL + 'api/desvincular', {
        method: 'POST',
        body: reqData,
        redirect: 'follow'
      });
      const res = await req.json();

      if (res.error) {
        alert("Error al desvincular cuenta, inténtelo más tarde");
        desasociando.value = false;
      } else {
        this.logoutConfirm();
      }
    },
    logoutConfirm() {
      const {isLogged} = loginService();
      isLogged.value = false;
      localStorage.clear();
      router.replace({name: 'login'})
    },
    submitChangePassword() {
      touchChangePassword.value = true
      changingPassword.value = true
      profileService.changePassword(emailAssociated.value).then(() => changingPassword.value = false)
    },
    soon() {
      alert("Disponible en breve")
    },
    back(params) {

    }
  }

  actions[actionName] ? actions[actionName](params) : null
}

</script>

<style scoped>
.label_cp {
  background: #339a5c;
  padding: 1rem .3rem;
  border-radius: .5rem;
}

.icon {
  width: 25px;
  margin-right: 2rem;
  margin-left: 1rem;
  padding-top: 1rem;
  filter: invert(1)
}

.icon_menu {
  margin-right: 2rem;
  margin-left: 1rem
}
</style>
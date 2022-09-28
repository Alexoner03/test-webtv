<template>
  <router-view/>
</template>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1; 
}

::-webkit-scrollbar-thumb {
  background: #888; 
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

:root{
  --va-dropdown-content-background: #51545d !important;
}

.vjs-theme-fantasy{
  --vjs-theme-fantasy--primary: white !important;
}

html{
  scroll-behavior: smooth;
}

body{
  background-color: #222327;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.va-navbar{
  height: auto !important;
  text-align: center;
}

.video-js .vjs-big-play-button{
  top: 48% !important;
  left: 47% !important;
}

.graybar{
  height: 5px;
  background-color: #727377;
  border-radius: 1px;
}

.whitebar{
  height: 5px;
  background-color: #fff;
  border-radius: 2px;
}

.text-gray, .graybar+div{
  color: #727377;
  width: 100%;
}
</style>
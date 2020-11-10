<template>
  <div id="app">    
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__fadeInDown animate__faster"
      leave-active-class="animate__animated animate__fadeOutUp animate__faster"
      >
  <router-view />
</transition>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>

html::-webkit-scrollbar {
  width: 0;
  height: 0;
} 
 html, body {
    height: 100%;
    margin: 0;
     background: rgb(13, 19, 38) !important;
}
</style>

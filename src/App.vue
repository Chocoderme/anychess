<template>
  <RouterView v-slot="{ Component }">
    <transition name="el-fade-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>

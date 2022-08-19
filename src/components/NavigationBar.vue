<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    :router="true"
  >
    <el-menu-item index="/">
      <img :src="LogoImage" alt="Anychess logo" height="32" />
      <label class="title">Anychess</label>
    </el-menu-item>
    <!-- <el-menu-item index="0">LOGO</el-menu-item> -->
    <div class="flex-grow" />
    <el-menu-item index="logic-builder">Processing Center</el-menu-item>
    <el-menu-item index="board">Board view</el-menu-item>
    <!-- <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->
  </el-menu>
</template>

<script lang="ts" setup>
  import LogoImage from "@/assets/logo.png?url";

  const activeIndex = ref("1");
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
  };
</script>

<style lang="scss" scoped>
  .flex-grow {
    flex-grow: 1;
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    box-sizing: border-box;
    padding: 5px 10px;
    overflow: hidden;
    height: 100%;

    img {
      height: 36px;
    }
  }

  .title {
    font-size: 1.4em;
    margin-left: 4px;
  }
</style>

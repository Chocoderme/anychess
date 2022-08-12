<template>
  <ElContainer style="min-height: 100vh">
    <ElHeader>
      <NavigationBar />
    </ElHeader>
    <ElMain>
      <div class="container">
        <Board />
      </div>
    </ElMain>
  </ElContainer>
</template>

<script lang="ts" setup>
  const isDarkMode = useDark();
  isDarkMode.value = true;
</script>

<style lang="scss" scoped>
  :deep(.el-header) {
    --el-header-padding: 0;
  }

  .container {
    width: calc(100vmin - var(--el-header-height, 60px) - 100px);
    padding-top: 30px;
    aspect-ratio: 1;
    margin: 0 auto;
  }
</style>

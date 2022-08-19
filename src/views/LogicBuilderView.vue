<template>
  <ElContainer style="min-height: 100vh">
    <ElHeader>
      <NavigationBar />
    </ElHeader>
    <ElContainer>
      <ElAside width="100px">
        <PieceNavigator />
      </ElAside>
      <ElMain>
        <div class="container">
          <PieceLogicBuilder v-if="pieceLogicStore.activeType" />
        </div>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<script lang="ts" setup>
  import { usePieceLogicStore } from "@/stores/pieceLogic";

  const isDarkMode = useDark();
  isDarkMode.value = true;

  const pieceLogicStore = usePieceLogicStore();
  pieceLogicStore.reset();
</script>

<style lang="scss" scoped>
  :deep(.el-header) {
    --el-header-padding: 0;
  }

  .container {
    margin: 0 auto;
    height: 100%;
    position: relative;
  }
</style>

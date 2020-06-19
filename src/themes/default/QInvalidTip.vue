<template>
  <m-typo-body :level="1" class="invalid-tip">
    <slot />
  </m-typo-body>
</template>
<style scoped>
.invalid-tip { color: #d93025; display: block; }
</style>

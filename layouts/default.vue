<template>
  <div id="layout">
    <p>Some default layout content shared across all pages</p>
	<el-button @click="ElMessage('hello')">button</el-button>
	<ElButton :icon="ElIconEditPen" type="success">button</ElButton>
	<LazyElButton type="warning">lazy button</LazyElButton>
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import autoAnimate from "@formkit/auto-animate"

const layout = ref() // we need a DOM node
const show = ref(false)

onMounted(() => {
  autoAnimate(dropdown.value) // thats it!
})
</script>
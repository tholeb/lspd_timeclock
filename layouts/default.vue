<template>
	<div id="layout">
		<p>Some default layout content shared across all pages</p>
		<el-button @click="ElMessage('hello')">
			button
		</el-button>
		<ElButton
			:icon="ElIconEditPen"
			type="success"
		>
			button
		</ElButton>
		<LazyElButton type="warning">
			lazy button
		</LazyElButton>
		<slot />
	</div>
</template>
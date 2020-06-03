<template>
  <div>
    <el-button
      @click.native.prevent="dialogVisible = true"
      type="text"
      size="small"
      >Поделиться</el-button
    >

    <el-dialog
      title="Поделиться проектом"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <span
        >Ссылка на проект
        <b>https://deepverification.web.app/projects/{{ project.id }}</b></span
      >
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ShareProject",
  props: ["project"],
  data: () => ({
    dialogVisible: false
  })
};
</script>

<style scoped></style>

<template>
  <fragment>
    <el-button
      @click.native.prevent="dialogVisible = true"
      type="text"
      size="small"
      v-if="!menu"
      >Поделиться</el-button
    >
    <el-menu-item @click="dialogVisible = true" v-if="menu"
      ><i class="el-icon-share"></i
    ></el-menu-item>

    <el-dialog
      title="Поделиться проектом"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <span>Ссылка для добавления в коллекцию </span
      ><span
        ><b>https://deepverification.web.app/share/{{ project.id }}</b></span
      >
      <el-button @click="copy">Скопировать ссылку</el-button>
    </el-dialog>
  </fragment>
</template>

<script>
import copy from "copy-to-clipboard";

export default {
  name: "ShareProject",
  props: ["project", "menu"],
  data: () => ({
    dialogVisible: false
  }),
  methods: {
    copy() {
      copy("https://deepverification.web.app/share/" + this.project.id);
    }
  }
};
</script>

<style scoped></style>

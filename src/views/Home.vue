<template>
  <div class="home">
    <Menu></Menu>
    <template>
      <el-table
        :data="
          projects.sort((a, b) => {
            if (a.lastEdit < b.lastEdit) {
              return 1;
            }
            if (a.lastEdit > b.lastEdit) {
              return -1;
            }
            return 0;
          })
        "
        stripe
        style="width: 100%"
      >
        <el-table-column prop="name" label="Название">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="
                $router.push({ path: '/project/' + projects[scope.$index].id })
              "
              type="text"
              >{{ projects[scope.$index].name }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="author" label="Владелец">
          <template slot-scope="scope">
            {{
              projects[scope.$index].author.uid === user.uid
                ? "Я"
                : projects[scope.$index].author.displayName
            }}
          </template>
        </el-table-column>
        <el-table-column prop="lastEdit" label="Последнее редактирование">
          <template slot-scope="scope">
            <timeago
              :datetime="new Date(projects[scope.$index].lastEdit)"
            ></timeago>
          </template>
        </el-table-column>
        <el-table-column label="Действия" width="120">
          <template slot-scope="scope">
            <DeleteProject :project="projects[scope.$index]" />
            <ShareProject :project="projects[scope.$index]" />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import firebase, { db } from "../firebase";
import "firebase/firestore";
import Menu from "../components/Menu";
import DeleteProject from "../components/DeleteProject";
import ShareProject from "../components/ShareProject";

export default {
  name: "home",
  computed: {
    user() {
      return firebase.auth().currentUser;
    },
    projects() {
      return this.$store.state.projects_i.concat(this.$store.state.projects_c);
    }
  },
  components: { ShareProject, DeleteProject, Menu },
  methods: {}
};
</script>

<template>
  <div class="home">
    <Menu></Menu>

    <template>
      <el-table :data="projects" stripe style="width: 100%">
        <el-table-column prop="name" label="Название">
          <template slot-scope="scope">
            <router-link :to="'/project/' + projects[scope.$index].id">
              {{ projects[scope.$index].name }}
            </router-link>
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
// @ is an alias to /src
import firebase, { db } from "../firebase";
import "firebase/firestore";
import Menu from "../components/Menu";
import DeleteProject from "../components/DeleteProject";
import ShareProject from "../components/ShareProject";

const projects = db.collection("projects");

export default {
  name: "home",
  computed: {
    user() {
      return firebase.auth().currentUser;
    }
  },
  components: { ShareProject, DeleteProject, Menu },
  methods: {
    createProject() {
      if (this.form.name) {
        db.collection("projects").add({
          name: this.form.name,
          author: { displayName: this.user.displayName, uid: this.user.uid },
          lastEdit: Date.now()
        });
        this.form.name = null;
      } else {
        this.$notify.error({
          title: "Ошибка",
          message: "Новый проект должен иметь название"
        });
      }
    }
  },
  data: () => ({
    projects: [],
    form: { name: null }
  }),
  mounted() {
    this.$bind(
      "projects",
      projects.where("author.uid", "==", this.user.uid)
    ).then(projects => {
      this.projects = projects;
    });
  }
};
</script>

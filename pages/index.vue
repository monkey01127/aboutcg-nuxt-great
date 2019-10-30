<template>
  <div class="container">
    <div>
      <logo />
      <div class="btns">
        <div class="btn button--grey" @click="login" v-if="!beforeCreate.hasLogin">登录</div>
        <div class="btn button--grey" @click="logout" v-else>退出登录</div>
      </div>
        {{beforeCreate.initData}}
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';
import IndexService from '@/services/initial';
const TOKEN_KEY = '_user_token';
export default {
    components: {
        Logo
    },
    data() {
        return {
            beforeCreate: {
                initData: null, // 初始化数据
                initialized: false, // 公共状态，表示是否有获取过初始化数据
                hasLogin: false // 公共参数，表示是否已登录，根据自身情况，这个不是必须
            }
        };
    },
    async asyncData({ app }) {
        return await new IndexService(app).asyncData();
    },
    mounted() {
        this.initPageData();
    },
    methods: {
        async initPageData() {
            const data = await new IndexService(this).asyncData();
            this.beforeCreate = data.beforeCreate;
        },
        async login() {
            this.$cookie.set(TOKEN_KEY, 'test-user-token');
            window.location.reload();
        },
        async logout() {
            this.$cookie.del(TOKEN_KEY);
            window.location.reload();
        }
    }
};
</script>

<style lang="scss">
  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }
  .btns {
    .btn {
      color: #35495e;
      padding-bottom: 15px;
    }
  }
</style>

const TOKEN_KEY = '_user_token';
const isServer = process.server;
class Base {
    constructor(context) {
        this.context = context;
        const token = this.context.$cookie.get(TOKEN_KEY);
        this.hasLogin = !!token;
        this.beforeCreate = {
            initialized: false,
            hasLogin: this.hasLogin
        };
    }
    async asyncData() {
        if (isServer) {
            if (this.hasLogin) {
                this.beforeCreate.initialized = false;
                return {
                    beforeCreate: this.beforeCreate
                };
            } else {
                return this.handler();
            }
        } else {
            if (this.hasLogin) {
                return this.handler();
            } else {
                return {
                    beforeCreate: this.context.beforeCreate
                };
            }
        }
    }
    async processInitData(data) {
        this.beforeCreate.initialized = true;
        this.beforeCreate.initData = data;
        return {
            beforeCreate: this.beforeCreate
        };
    }
}
export default Base;

import {defineStore} from 'pinia'

export const useAuthStore = defineStore('authStore', {
    state: ()=>({
        isLoggedIn: false,
        userName: '' as string,
        role: null as 'user'|'admin'| null
    }),

    getters: {
        isAdmin:(state)=>state.role==='admin'
    },

    actions: {
        login(name: string, role: 'user'|'admin'){
            this.userName=name;
            this.role=role;
            this.isLoggedIn=true;
        },
        logout(){
            this.userName='';
            this.role=null;
            this.isLoggedIn=false;
        }
    }
});

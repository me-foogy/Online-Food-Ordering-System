import {defineStore} from 'pinia'

export const useAuthStore = defineStore('authStore', {
    state: ()=>({
        isLoggedIn: false,
        userName: '' as string,
    }),
    actions: {
        login(name: string){
            this.userName=name;
            this.isLoggedIn=true;
        },
        logout(){
            this.userName='';
            this.isLoggedIn=false;
        }
    }
});

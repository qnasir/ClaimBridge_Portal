import {makeAutoObservable} from 'mobx';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
}

class UserStore {
    user: User = null;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(userData: User) {
        this.user = userData;
    }

    logout() {
        this.user = null;
    }
}

export const userStore = new UserStore();
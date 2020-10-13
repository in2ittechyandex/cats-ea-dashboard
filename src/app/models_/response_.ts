import { UserTab } from './tab';
export class APIResponse {
   public status: Boolean = false;
   public data: Array<UserTab> = [];

    constructor(obj) {
        this.status = obj.status;
        if (obj && obj.data) {
            const tabs: UserTab[] = [];
            for (let i = 0; i < obj.data.length; i++) {
                const tab: UserTab = new UserTab(obj.data[i]);
                tabs[i] = tab;
            }
            this.data = tabs;
        }
    }

}

import { Filter } from './tab';
export class LoggedUser {
    userName: String;
    name: String;
    title: String;
    profileImg: String;
    perm_: Array<any>;

    constructor(obj) {
        this.userName = (obj && obj['userName']) ? obj['userName'] : null;
        this.name = (obj && obj['name']) ? obj['name'] : null;
        this.title = (obj && obj['title']) ? obj['title'] : null;
        this.profileImg = (obj && (obj['profileImg']!="" || obj['profileImg']!=null )) ? obj['profileImg'] : this.getUserImage(obj);
        this.perm_ = (obj && obj['perm_']) ? obj['perm_'] : [];
    }

    /**
     * seprate DB permissions from array
     * @param arr arr having all permission including DB,EA etc
     */
    getRolePermissions(arr: Array<any>): Array<any> {
        const permArr = [];
        arr.filter(elm => {
            if (elm['function_name'] == 'DB') {
                permArr.push(elm['permission_name']);
                return true;
            } else {
                return false;
            }
        });
        return permArr;
    }


    getUserImage(obj) {
        if (obj['userName'] != '') {
            const str: string = obj['userName'];
            const arr = Array.from(str);
            const imgName = arr[0].toLowerCase();
            return 'assets/img_alpha/' + imgName + '.png';
        } else {
            return 'assets/img_alpha/i.png';
        }
    }


}

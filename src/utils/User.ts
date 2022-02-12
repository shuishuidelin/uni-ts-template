import { AuthData, UserReg } from "@/bean/UserModel";
import { Api, ConstValue } from "@/Const/ConstValue";
import FetchManager from "@/NetWork/FetchManage";
import store from "@/store";
import { developCall } from "./StaticFunUtils";

export default class User {
    private static instance: User;
    private customKey: string = "";
    public static getInstance(): User {
        if (!User.instance) {
            User.instance = new User()
        }
        return User.instance;
    }
    public initUser() {
        let userInfo = this.getUserInfo();
        if (!userInfo || !userInfo.customKey) return this.userReg();
        wx.checkSession().then(() => {
            this.setCustomKey(userInfo.customKey)
            this.getSeveryUserInfo();
        }).catch(() => {
            this.userReg();
        })
    }
    public userReg() {
        const that = this;
        console.log("调用wxlogin");
        uni.login({
            provider: 'weixin',
            success(res) {
                const code = res.code;
                FetchManager.postCommon<UserReg>(Api.xcxReg, {
                    code
                }).then(res => {
                    if (res.data[0] && res.data[0].customKey) {
                        that.setCustomKey(res.data[0].customKey);
                        that.getSeveryUserInfo();
                    }
                })
            }
        })
    }
    /**用户授权 */
    public userAuth(): Promise<void> {
        return wx.getUserProfile({ desc: "为了我们能更好为您提供服务" }).then(info => {
            console.log(info);
            const userInfo = {
                nickName: info.userInfo.nickName,
                avatarUrl: info.userInfo.avatarUrl,
                gender: info.userInfo.gender
            }
            return FetchManager.postCommon<AuthData>(Api.xcxAuthReg, {
                authInfo: {
                    iv: info.iv,
                    encryptedData: info.encryptedData,
                    sessionKey: "",
                    userInfo
                }
            })
        }).then(res => {
            this.setCustomKey(res.data[0].customKey);
            this.setUserInfo(res.data[0]);
            return Promise.resolve()
        }).catch(err => {
            return Promise.resolve()
        })
    }
    public getSeveryUserInfo() {
        FetchManager.postCommon(Api.userinfos, {
            storeUuid: store.state.storeUuid
        }).then(res => {
            // res.data[0].headImg = "";
            // res.data[0].userName = "";
            // res.data[0].extInfo.phone = "";
            this.setUserInfo(res.data[0])
        }).catch(() => {
            uni.removeStorageSync(ConstValue.userInfo)
        })
    }
    public getCustomKey() {
        let customKey = this.customKey;
        if (!customKey) {
            let userInfo = this.getUserInfo();
            if (userInfo && userInfo.customKey) this.customKey = customKey = userInfo.customKey;
        }
        return customKey;
    };
    public setCustomKey(customKey: string): void {
        if (!customKey) return;
        this.customKey = customKey;
        let userInfo = this.getUserInfo();
        userInfo.customKey = customKey;
        this.setUserInfo(userInfo);
    }
    public setUserInfo(userInfo: AuthData): void {
        userInfo.gender = (<string><unknown>userInfo.gender) == '女' ? 2 : 1;
        store.commit("editUsername", userInfo.userName);
        store.commit("editHeadImg", userInfo.headImg);
        store.commit("editGender", userInfo.gender == 1 ? 1 : 2);
        // developCall(() => {
        //     userInfo.role = 0
        // })
        store.commit("editManagementAuth", userInfo.role > 0);
        uni.setStorageSync(ConstValue.userInfo, userInfo)
    }
    public getUserInfo(): AuthData { return uni.getStorageSync(ConstValue.userInfo) || {} }
    /**
     * ifAuth
     */
    public ifAuth(): boolean {
        let userInfo = this.getUserInfo();
        if (userInfo.userName && userInfo.headImg) {
            return false
        }
        return true
    }
}
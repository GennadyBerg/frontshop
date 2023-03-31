import { arrayMoveImmutable } from "array-move";

export class UserEntity {
    #acl = [];
    get acl() {
        return [...this.#acl];
    }
    constructor(user) {
        this._id = user._id;
        this.nick = user.nick;
        this.login = user.login;
        this.avatar = user.avatar ? { ...user.avatar } : null;
        this.#acl = [...(user.acl ?? [])];
        this.#fixRoles();
    }
    #fixRoles = () => {
        let _id = this._id;
        let acl = this.#acl;
        let onlyAllowedAcls = acl.filter(a => a === this._id || a === "user" || a === "admin");
        if (onlyAllowedAcls.length !== acl.length) {
            let uniqueRoles = new Set(onlyAllowedAcls);
            if (uniqueRoles.length !== acl.length) {
                this.#acl = acl = [...uniqueRoles];
            }
        }
        if (_id) {
            let myRoleIdx = this.#getRoleIdx(_id);
            if (myRoleIdx < 0) {
                acl.splice(0, 0, _id);
            }
            else if (myRoleIdx > 0) {
                this.#acl = acl = arrayMoveImmutable(acl, myRoleIdx, 0);
            }
        }
        let rolesCnt = this.acl.length;
        let offset = _id ? 1 : 0;
        if (rolesCnt === offset) {
            acl.push("user")
        }
        else if (rolesCnt > offset && acl[offset] !== "user") {
            if (rolesCnt === offset + 1) {
                acl.splice(1, 0, "user")
            }
            else {
                this.#acl = acl = arrayMoveImmutable(acl, offset, offset + 1);
            }
        }
    }


    #getRoleIdx = (role) => {
        let res = this.#acl?.indexOf(role);
        return res ?? -1;
    }
    #isRole = (role) => this.#getRoleIdx(role) >= 0;
    get isAdminRole() { return this.#isRole("admin"); }
    get isUserRole() {
        return this.#isRole("user");
    }
    onSetRoleInt = () => {
        this.onSetRole(this);
        this.#fixRoles();
    }
    #setRole = (role, isSet, onSetRole = undefined) => {
        this.#acl ??= [];
        let roleIdx = this.#getRoleIdx(role);
        if (isSet) {
            if (roleIdx < 0) {
                this.#acl.push(role);
                if (this.onSetRole)
                    this.onSetRoleInt();
            }
        }
        else {
            if (roleIdx >= 0) {
                this.#acl.splice(roleIdx, 1);
                if (onSetRole)
                    this.onSetRoleInt();
            }
        }
    }
    setAdminRole = (isSet, onSetRole = undefined) => { this.#setRole("admin", isSet, onSetRole) };
    setUserRole = (isSet, onSetRole = undefined) => { this.#setRole("user", isSet, onSetRole) };
}
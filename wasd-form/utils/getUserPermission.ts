export default function getUserPermission(permissionSet: Array<string>) {
    
    if(!permissionSet) return "Member";

    let highestPermission = 4;

    for(var i of permissionSet) {
        if(permissionTable[i] < highestPermission) highestPermission = permissionTable[i];
    }

    return permissions[highestPermission];
}


/*
    What is superuser?
    superuser is an admin but with advanced permissions to execute commands on the backend server/take the website offline for maintenince 
*/
export const permissionTable : { [unit: string]: number} = {
    SUPERUSER: 0,
    ADMINISTRATOR: 1,
    MODERATOR: 2,
    TRIAL_MOD: 3,
    ALLOW_POSTING: 4,
}

export const permissions : { [unit: number]: string } = {
    0: "Superuser",
    1: "Administrator",
    2: "Moderator",
    3: "Trial moderator",
    4: "Member"
}

export const colorPermissionTable : { [unit: string]: string} = {
    SUPERUSER: "perm-su",
    ADMINISTRATOR: "perm-admin",
    MODERATOR: "perm-mod",
    TRIAL_MOD: "perm-trial",
    ALLOW_POSTING: "perm-member",
}

export function getPermissionColor(permissionSet: Array<string>){
    if(!permissionSet) return "perm-member";

    let highestPermission = 4;
    let color = "perm-member";

    for(var i of permissionSet) {
        if(permissionTable[i] < highestPermission) color = colorPermissionTable[i];
    }

    return color;
} 
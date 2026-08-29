export interface AuthResponse {
    access_token: string
    expires_in: string
    refresh_expires_in: string
    refresh_token: string
    token_type: string
    session_state: string
    scope: string
}


export  interface Credentials {
    login?: string
    password?: string

    username?: string
    access_token?: string
    token: string
    expires_in?: string
    refresh_expires_in?: string
    refresh_token?: string
    token_type?: string
    session_state?: string
    scope?: string
}

export interface ResetOrForgetFormDTO {
    login?: string
    password?: string
    newPassword?: string
    passwordConfirmed?: string
}

export interface ActivateAccountDTO {
    matricule: string
    defaultPassword: string
    newPassword: string
    passwordConfirmed: string
}



export interface UserToken {
    id: number
    email: string
    matricule?: string
    prenom: string
    nom: string
    profil: Profil[]
    status: boolean
}

export interface Profil {
    id: number
    code: string
    label: string
    menus: Menu[]
}

export interface Menu {
    menId: number
    menPath: string
    menTitle: string
    menType: string
    menIconType: any
    children: Children[]
}

export interface Children {
    menId: number
    menPath: string
    menTitle: string
    menType: string
    menIconType: any
    children: any[]
}

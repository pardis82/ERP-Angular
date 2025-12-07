export interface Iuser{
    id:number , 
    name: string,
    username: string
    email: string ,
    address: {
        street: string 
    }
    
}

export type NewUser = Omit<Iuser,'id'>
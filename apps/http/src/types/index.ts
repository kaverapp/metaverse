import  z  from "zod";

export const SignupSchema=z.object({
    username:z.string(),
    password:z.string().min(10),
    type:z.enum(["USER","ADMIN"])
})

export const SigninSchema=z.object({
    username:z.string(),
    password:z.string().min(10),
})

export const updateMetadataSchema=z.object({
    avatarId:z.string(),
})

export const CreateSpaceSchema=z.object({
    name:z.string(),
    //custom function that validates 100X100 schema
    dimensions:z.string().regex(/^[0-9]{1,5}x[0-9]{1,5}$/),
    mapId:z.string(),
})

export const addElementSchema=z.object({
    spaceId:z.string(),
    elementId:z.string(),
    x:z.number(),
    y:z.number(),
})

export const CreateElementSchema=z.object({
    imageUrl:z.string(),
    width:z.number(),
    height:z.number(),
    static:z.boolean(),
})

export const UpdateElementSchema=z.object({
    imageUrl:z.string(),

})

export const CreateAvatarSchema=z.object({
    imageUrl:z.string(),
    name:z.string(),
})

export const CreateMapSchema=z.object({
    thumbnail:z.string(),
    dimensions:z.string().regex(/^[0-9]{1,5}x[0-9]{1,5}$/),
    defaultElements:z.array(z.object({
        elementId:z.string(),
        x:z.number(),
        y:z.number(),
    }))

})
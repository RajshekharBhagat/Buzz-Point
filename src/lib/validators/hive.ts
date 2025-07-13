import {z} from 'zod';
export const CreateHiveValidator = z.object({
    name: z.string().min(3).max(21),
    description: z.string().optional(),
})

export const HiveSubscriptionValidator = z.object({
    hiveId: z.string(),
});


export type CreateHivePayload = z.infer<typeof CreateHiveValidator>;
export type HiveSubscriptionPayload = z.infer<typeof HiveSubscriptionValidator>
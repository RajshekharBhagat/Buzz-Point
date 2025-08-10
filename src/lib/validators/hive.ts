import {z} from 'zod';
export const CreateHiveValidator = z.object({
    name: z.string().min(3).max(21),
    description: z.string().optional(),
})

export type CreateHivePayload = z.infer<typeof CreateHiveValidator>;

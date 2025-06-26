import * as z from 'zod'

export const userProfileSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email()
});


export const companyProfileSchema = z.object({
  id: z.string(),
  companyName: z.string().optional(),
  companyDomain: z.string().nullable(),
});
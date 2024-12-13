'use server'

import { validatedAction } from '@/lib/auth/middleware'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

export const signInWithMagicLink = validatedAction(
    z.object({
        email: z.string().email(),
        redirect: z.string().optional(),
    }),
    async(data) => {
        const supabase = await createClient();
        const {email} = data;
        const redirectTo = 'https:localhost:3000/dashboard/home';

        const {error} = await supabase.auth.signInWithOtp({
            email,
            options:{
                emailRedirectTo: redirectTo,
                shouldCreateUser: false,
            }
        });
        if(error){
            console.log("Error Sending Magic Link", error);
            return {error: error.message};
        }
        return {success: `Magic Link sent to ${email}`};
    }
)

export async function verifyOtp(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const otp = formData.get('otp') as string

    if (!email || !otp) {
        return { success: false, message: 'Email and OTP are required' }
    }

    const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
    })

    if (error) {
        return { success: false, message: error.message }
    }

    return { success: true }
}

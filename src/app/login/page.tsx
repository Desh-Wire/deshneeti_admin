'use client'

import { useActionState, useEffect, useState } from 'react'
import { signInWithMagicLink, verifyOtp } from '@/app/login/actions'
import { ActionState } from '@/lib/auth/middleware'

export default function LoginPage() {
    const [loading, setLoading] = useState<boolean>(false)
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState<string>('')
    const [otp, setOtp] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('email', email)
        formData.append('otp', otp)

        const result = await verifyOtp(formData)

        if (result?.success) {
            window.location.href = '/dashboard'
        } else {
            setErrorMessage(result?.message || 'Failed to verify OTP')
        }
    }

    const [magicLinkState, magicLinkAction, pending] = useActionState<ActionState, FormData>(signInWithMagicLink, { error: "", success: "" });

    useEffect(() => {
        if (magicLinkState.success) {
            setStep('otp')
        }
        if (magicLinkState.error) {
            setErrorMessage(magicLinkState.error)
        }
    }, [pending])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            {errorMessage && (
                <div className="mb-4 text-red-500 font-semibold">{errorMessage}</div>
            )}

            {step === 'email' ? (
                <form
                    action={magicLinkAction}
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                        Email:
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={pending}
                    >
                        {pending ? 'Sending...' : 'Send Magic Link'}
                    </button>
                </form>
            ) : (
                <form
                    onSubmit={handleVerifyOtp}
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <input type="hidden" name="email" value={email} />
                    <label htmlFor="otp" className="block text-gray-700 font-bold mb-2">
                        Enter OTP:
                    </label>
                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Verify OTP
                    </button>
                </form>
            )}
        </div>
    )
}

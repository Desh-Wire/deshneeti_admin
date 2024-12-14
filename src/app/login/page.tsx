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
        setLoading(true)
        const formData = new FormData()
        formData.append('email', email)
        formData.append('otp', otp)

        const result = await verifyOtp(formData)
        setLoading(false)

        if (result?.success) {
            window.location.href = '/dashboard/home'
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                {errorMessage && (
                    <div className="mb-4 p-3 text-red-600 bg-red-100 rounded-md text-sm font-medium">
                        {errorMessage}
                    </div>
                )}

                {step === 'email' ? (
                    <form
                        action={magicLinkAction}
                        className="flex flex-col space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={pending}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`flex items-center justify-center w-full px-4 py-2 text-white font-medium rounded-lg ${
                                pending
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } focus:outline-none focus:ring focus:ring-blue-300`}
                            disabled={pending}
                        >
                            {pending ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form
                        onSubmit={handleVerifyOtp}
                        className="flex flex-col space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Enter OTP
                            </label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`flex items-center justify-center w-full px-4 py-2 text-white font-medium rounded-lg ${
                                loading
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } focus:outline-none focus:ring focus:ring-blue-300`}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

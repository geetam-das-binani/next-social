"use client"
import { useFormStatus } from 'react-dom'
const UpdateButton = () => {
    const { pending } = useFormStatus()
    return (

        <button disabled={pending} className="bg-blue-500 absolute w-full top-[100%] disabled:bg-opacity-50  disabled:cursor-not-allowed   p-2 mt-2 rounded-md text-white">
            {
                pending ?  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" /> : "Update"
            }
        </button>
    )
}

export default UpdateButton

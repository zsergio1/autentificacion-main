"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter()
  const [error, setError] = useState(null)

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log(res)
    if (res.error) {
      setError(res.error)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  });


  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center bg-slate-200">
      <form onSubmit={onSubmit} className="w-1/4 bg-slate-200 p-8 rounded-lg shadow-lg border-2 border-transparent border-opacity-50" style={{
        transition: 'border-color 0.1s ease',
        borderColor: 'transparent',
        
      }}>
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mb-4">{error}</p>
        )}

        <h1 className="text-black font-bold text-4xl mb-6">Iniciar sesión</h1>


        <div className="mb-4">
          <label htmlFor="email" className="text-slate-500 block text-sm mb-2">
            Email:
          </label>
          <input
            type="email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
            })}
            className="p-3 rounded block mb-2 bg-slate-200 text-slate-300 w-full focus:border-neon"
            placeholder="user@email.com"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="text-slate-500 block text-sm mb-2">
            Password:
          </label>
          <input
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
            className="p-3 rounded block mb-2 bg-slate-200 text-slate-300 w-full focus:border-neon"
            placeholder="******"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password.message}</span>
          )}
        </div>

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
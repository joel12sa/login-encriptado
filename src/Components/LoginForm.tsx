// src/components/LoginForm.tsx
'use client';
import { useState } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';

type FormInputs = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success) {
      alert('Login successful');
    } else {
      setErrorMessage('Nombre de usuario o contraseña inválidos');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-semibold mb-7 text-center text-gray-500">Iniciar sesión</h2>

      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            {...register('username', { required: 'El nombre de usuario es requerido' })}
            className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
          />
          {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'La contraseña es requerida' })}
            className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
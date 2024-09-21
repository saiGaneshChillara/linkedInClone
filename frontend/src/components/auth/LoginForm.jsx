import React, { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from '../../lib/axios';
import toast, { LoaderIcon } from 'react-hot-toast';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const queryClient = useQueryClient();

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation({ username, password });
    };

    const { mutate: loginMutation, isLoading } = useMutation({
        mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['authUser']});
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Something went wrong");
        },
    });
    return (
        <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
            <div>
                <input 
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='input input-bordered w-full'
                    required
                />
            </div>
            <div>
                <input 
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='input input-bordered w-full'
                    required
                />
            </div>
            <button type='submit' className='btn btn-primary w-full'>
                {isLoading ? <Loader className="size-5 animate-spin" /> : "Sign in"}
            </button>
        </form>
    );
};

export default LoginForm;
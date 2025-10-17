"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../../firebaseConfig'; // Ajusta la ruta
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/Components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/Components/ui/input-group"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/Components/ui/tooltip"
import { HelpCircle, InfoIcon } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
     // On success, redirect to the dashboard or home page
      router.push('/dashboard');
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Failed to sign in:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard'); // Redirect on successful login
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Failed to sign in with Google:", err);
    }
  };

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='shadow-lg w-[320px] h-auto rounded flex flex-col justify-start items-center gap-2 border pb-9'>

        <div className='grid w-full p-2 gap-2'>
          <div className='title py-9'>
            <h2 className='text-center text-xl font-bold text-blue-rr'>Bienvenido, Ingrese su información para continuar</h2>
          </div>
          
          <form onSubmit={handleSignIn} className='flex flex-col justify-center  gap-2'>
            <InputGroup>
              <InputGroupInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo Electrónico" />
              <InputGroupAddon align="inline-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      variant="ghost"
                      aria-label="Help"
                      size="icon-xs"
                    >
                      <HelpCircle />
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Usa el email de RR dado de alta</p>
                  </TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <InputGroupInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña" type="password" />
              <InputGroupAddon align="inline-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      variant="ghost"
                      aria-label="Info"
                      size="icon-xs"
                    >
                      <InfoIcon />
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Password asignado</p>
                  </TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            </InputGroup>
            <Button type='submit' onClick={handleSignIn} size="lg" variant="outline" className='bg-white rounded py-2 flex justify-center items-center cursor-pointer'>
              <span className='text-black'>Login</span>
            </Button>
            {error && <p className='w-full text-center' style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
        <span className='py-0 font-bold text-center text-blue-rr w-full overline border-t-1 my-5'></span>
        <Button onClick={handleGoogleSignIn} size="lg" variant="outline" className='bg-white rounded py-2 flex justify-center items-center cursor-pointer'>
          <Image width={20} height={20} alt='Google' src="data:image/png;base64,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" />
          <span className='text-black'>Login with Google</span>
        </Button>

      </div>
    </div>
  );
}
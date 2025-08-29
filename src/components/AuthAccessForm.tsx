import { useState } from 'react';
import folderBg from '../assets/LabelAuth.svg';

export default function AccessForm() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Key:', key);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-[500px] max-w-full text-black "
    >
      <img
        src={folderBg}
        alt="Folder Background"
        className="w-full select-none pointer-events-none"
      />


      <div className="absolute inset-0 px-10 pt-12 flex flex-col gap-2">
        <label className="flex flex-col text-left font-semibold">
          Ваш email або логін
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className=" mr-8 bg-gray-300/80 border border-white outline-none px-4 py-3 placeholder:text-zinc-600 focus:bg-white transition-all duration-200 focus:border-gray-400"
            />

        <label className="flex flex-col text-left font-semibold">
          Код доступу
            </label>
          <div className="mt-2 flex gap-2 items-center">
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
              className="flex-1 bg-gray-300/80 border border-white outline-none px-4 py-3 placeholder:text-zinc-600 focus:bg-white transition-all duration-200 focus:border-gray-400"
            />
            {/* Возможна переработка "?" */}
            <button
              type="button"
              onClick={() => setShow(!show)}
              title="Показати/сховати"
              className="text-lg font-bold px-2 hover:text-gray-600 transition-colors duration-200"
            >
              ?
            </button>
          </div>

        <button type="submit" className="self-end mt-4 mr-10 px-6 py-2 bg-[#121212] text-white hover:bg-[#0a0a0a] transition-colors duration-200">
        <span className="text-[#EFEFF2] font-TT_Autonomous_Trial_Variable text-lg font-extrabold mb-6 opacity-90">
        Увійти
        </span> 
        </button>
      </div>
    </form>
  );
}

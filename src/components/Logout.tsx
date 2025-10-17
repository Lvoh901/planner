import { LogOut } from 'lucide-react';
import supabase from '../supabase';

export default function Logout() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return <button onClick={handleLogout} className='bg-red-600 text-white font-bold uppercase text-xs rounded-md hover:shadow-md cursor-pointer hover:scale-105 px-2 py-3 flex gap-1 items-center'>Logout <LogOut className='w-5 h-5' /></button>;
}

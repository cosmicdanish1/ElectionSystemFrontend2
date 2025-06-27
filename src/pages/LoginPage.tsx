"use client";
import React from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";
import { loginUser } from "../api/apiService";
import type { UserLoginData } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function LoginFormDemo() {
  const [formData, setFormData] = React.useState<UserLoginData>({
    email: "",
    password: "",
    role: "voter",
  });
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (role: 'voter' | 'committee') => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const user = await loginUser(formData);
      // Fetch voter info if user is a voter
      let updatedUser = user;
      if (user.role === 'voter') {
        try {
          const voterRes = await fetch(`/api/voters/by-user/${user.id}`);
          if (voterRes.ok) {
            const voterData = await voterRes.json();
            updatedUser = { ...user, vid: voterData.vid };
          }
        } catch (fetchErr) {
          // Optionally handle fetch error (e.g., log it)
        }
      }
      login(updatedUser);
      toast.success('Login successful!');

      if (user.role === 'committee') {
        navigate('/committee-dashboard');
      } else {
        navigate('/voter-dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="no-scrollbar rounded-2xl shadow-input mx-auto w-full max-w-md bg-white p-4 md:rounded-2xl md:p-8 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-end">
        <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
      
      <h2 className="text-xl font-bold text-neutral-800">
        Login to Your Account
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600">
        Enter your credentials to access your account.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="you@example.com" type="email" value={formData.email} onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" value={formData.password} onChange={handleChange} />
        </LabelInputContainer>

        <div className="mb-8">
          <Label className="mb-2 block text-sm font-medium text-neutral-800">Select your role</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="role-voter-login"
                type="radio"
                name="role-login"
                value="voter"
                checked={formData.role === "voter"}
                onChange={() => handleRoleChange("voter")}
                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
              />
              <Label htmlFor="role-voter-login" className="ml-2 block text-sm text-neutral-700">Voter</Label>
            </div>
            <div className="flex items-center">
              <input
                id="role-committee-login"
                type="radio"
                name="role-login"
                value="committee"
                checked={formData.role === "committee"}
                onChange={() => handleRoleChange("committee")}
                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
              />
              <Label htmlFor="role-committee-login" className="ml-2 block text-sm text-neutral-700">Committee</Label>
            </div>
          </div>
        </div>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-md disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login →'}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);

export default LoginFormDemo;

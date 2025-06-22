"use client";
import React from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";
import { registerUser } from "../api/apiService";
import type { UserRegistrationData } from "../api/apiService";
import { useNavigate } from "react-router-dom";

type FormData = Omit<UserRegistrationData, 'name'>;

export function SignupFormDemo() {
  const [formData, setFormData] = React.useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    gender: "",
    date_of_birth: "",
    role: "voter",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (role: 'voter' | 'committee') => {
    setFormData({ ...formData, role });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.email || !formData.password || !formData.firstname) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const registeredUser = await registerUser(formData);
      console.log('Data from backend after registration:', registeredUser);
      alert('Registration successful!');
      
      // Redirect based on the role
      if (registeredUser.role === 'committee') {
        navigate('/committee-dashboard');
      } else {
        navigate('/voter-dashboard');
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scrollbar-hide rounded-2xl shadow-input mx-auto w-full max-w-md bg-white p-4 md:rounded-2xl md:p-8 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-neutral-800">
        Create Your Account
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600">
        Join us to cast your vote and participate in elections.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {error && <div className="p-2 mb-4 text-center text-sm text-white bg-red-500 rounded-md">{error}</div>}

        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="John" type="text" value={formData.firstname} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Doe" type="text" value={formData.lastname} onChange={handleChange} />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className={cn(
              "h-10 w-full rounded-md border-none border-input bg-gray-50 px-3 py-2 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2",
              !formData.gender && "text-neutral-400"
            )}
          >
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={cn("text-black", !formData.date_of_birth && "text-neutral-400")}
          />
        </LabelInputContainer>

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
                id="role-voter"
                type="radio"
                name="role"
                value="voter"
                checked={formData.role === "voter"}
                onChange={() => handleRoleChange("voter")}
                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
              />
              <Label htmlFor="role-voter" className="ml-2 block text-sm text-neutral-700">Voter</Label>
            </div>
            <div className="flex items-center">
              <input
                id="role-committee"
                type="radio"
                name="role"
                value="committee"
                checked={formData.role === "committee"}
                onChange={() => handleRoleChange("committee")}
                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
              />
              <Label htmlFor="role-committee" className="ml-2 block text-sm text-neutral-700">Committee</Label>
            </div>
          </div>
        </div>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-md disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Sign up →'}
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

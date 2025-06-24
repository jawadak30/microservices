import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/Api/axiosInstance";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Authcontext/AuthContext"; // Adjust path if needed

// Zod schema with name, email, password, confirm password
const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type RegisterData = z.infer<typeof schema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(schema),
  });

  const { fetchUser } = useAuth();

  const onSubmit = async (data: RegisterData) => {
    try {
      await axiosInstance.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      const success = await fetchUser();

      if (success) {
        navigate("/dashboard");
      } else {
        setError("email", {
          type: "server",
          message: "Failed to fetch user data after registration.",
        });
      }
    } catch (error: any) {
      // Clear previous errors if needed
      Object.keys(errors).forEach((field) =>
        setError(field as keyof RegisterData, { message: undefined })
      );

      if (error.response) {
        if (error.response.status === 422 && error.response.data?.errors) {
          // Backend validation errors
          const backendErrors = error.response.data.errors;
          Object.entries(backendErrors).forEach(([field, messages]) => {
            setError(field as keyof RegisterData, {
              type: "server",
              message: Array.isArray(messages) ? messages[0] : messages,
            });
          });
        } else if (error.response.status === 409) {
          // Conflict, e.g., email already exists
          const message =
            error.response.data?.message || "User already exists with this email";
          setError("email", { type: "server", message });
        } else {
          // Generic backend error (optional)
          setError("email", {
            type: "server",
            message:
              error.response.data?.message || "Registration failed. Please try again.",
          });
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register a new account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create a new account
        </p>
      </div>

      <div className="grid gap-6">
        {/* Name */}
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-500" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="grid gap-3">
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <Input
            id="password_confirmation"
            type="password"
            {...register("password_confirmation")}
            aria-invalid={!!errors.password_confirmation}
            aria-describedby="password_confirmation-error"
          />
          {errors.password_confirmation && (
            <p
              id="password_confirmation-error"
              className="text-sm text-red-500"
              role="alert"
            >
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </Button>

        {/* OR Google */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={() =>
            (window.location.href = "http://localhost:8000/api/auth/redirect/google")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24"
            height="24"
            className="mr-2"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.15 0 5.36 1.37 6.59 2.51l4.83-4.83C31.9 4.14 28.26 2.5 24 2.5 15.96 2.5 9.04 7.68 6.36 14.92l5.61 4.36C13.47 13.05 18.28 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.5c0-1.45-.13-2.82-.36-4.17H24v7.9h12.4c-.54 2.9-2.17 5.36-4.66 7.02l7.3 5.69c4.27-3.95 6.66-9.77 6.66-16.44z"
            />
            <path
              fill="#FBBC05"
              d="M12 28.28a14.48 14.48 0 0 1 0-8.56l-5.61-4.36a24.03 24.03 0 0 0 0 17.28l5.61-4.36z"
            />
            <path
              fill="#EA4335"
              d="M24 44.5c6.26 0 11.53-2.06 15.37-5.61l-7.3-5.69c-2.01 1.35-4.58 2.15-8.07 2.15-5.72 0-10.53-3.55-12.03-8.42l-5.61 4.36C9.04 40.32 15.96 44.5 24 44.5z"
            />
          </svg>
          Register with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  );
}

"use client"
import { Button, Card, CardBody, Checkbox, Input, Link } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useSignInWithEmailAndPassword, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase.config";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  useEffect(() => {
    document.title = 'Login now | Smart Original Brand Admin';
  }, []);
  // Initialize Firebase Authentication hook
  const [signInWithEmailAndPassword, , error] = useSignInWithEmailAndPassword(auth);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  // Hook to sign out user
  const [signOut] = useSignOut(auth);

  // State to manage password visibility
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  
  // Custom Axios hook for making HTTP requests
  const axiosPublic = useAxiosPublic();
  
  // Form state and validation using react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Function to handle form submission
  const onSubmit = async (data) => {
    setLoading(true)
    // Prepare user data for login
    const userData = { email: data.email, password: data.password };

    try {
      setLoading(true)
      // Sign in user with Firebase Authentication
      const result = await signInWithEmailAndPassword(data.email, data.password);
      
      if (result) {
        
        try {
          setLoading(true)
          // Send login data to backend API and receive JWT token
          const response = await axiosPublic.post('/roleauth/rolelogin', userData);
          
          // Extract token from response
          const token = response.data.token;
          
          // Store token in localStorage for future use
          login(token)
          
          // Show success message upon successful login
          Swal.fire({
            icon: "success",
            title: "Login Successful!",
          });
          
          // Redirect user to the specified 'from' path
          router.push("/")
        } catch (axiosError) {
          setLoading(false)
          signOut()
          // Handle Axios request errors
          console.error('Axios error:', axiosError);
          
          // Show error message for backend issues
          Swal.fire({
            icon: "error",
            title: "Backend Error",
            text: axiosError.message,
          });
        }
      }
    } catch (error) {
      setLoading(false)
      // Handle Firebase Authentication errors
      console.error('Login Error:', error);
    }
  };

  // Effect to handle and display authentication errors
  useEffect(() => {
    if (error) {
      let errorMessage;
      switch (error?.code) {
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please reset your password!";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid credentials. Please check your email and password!";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found. Please check your email!";
          break;
        case "auth/wrong-password":
          errorMessage = "Wrong password. Please try again!";
          break;
      }
      if(errorMessage){
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: errorMessage,
      });
      }
    }
  }, [error]);

  return (
    <section className="bg-gray-50">
      <div className="flex items-center justify-center min-h-screen">
        <div>
          <Card className="w-[350px] shadow p-4">
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-full flex-col mb-6 md:mb-0 gap-4">
                <div>
                  <h3 className="font-bold text-center text-2xl">LOG IN</h3>
                </div>
                {/* Input field for Email */}
                <Input 
                  radius="sm" 
                  size={"md"}
                  type="email" 
                  name="email"
                  label="Email" 
                  className="w-full"
                  variant="bordered" 
                  labelPlacement="outside" 
                  placeholder="Type Your Email" 
                  {...register("email", { required: "Please enter your email", pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Email is not valid" } })}
                  color={errors.email ? "danger" : "default"}
                />
                {/* Error message for Email validation */}
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                {/* Input field for Password */}
                <Input
                  radius="sm" 
                  size={"md"}
                  label="Password"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Enter your password"
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (<HiEyeOff />) : (<HiEye />)}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  className="w-full"
                  {...register("password", { required: "Please enter your password", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                  color={errors.password ? "danger" : "default"}
                />
                {/* Error message for Password validation */}
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                {/* Remember me checkbox and Forgot Password link */}
                <div className="flex items-center justify-between pb-3">
                  <Checkbox size="sm" color="default" defaultChecked>Remember me</Checkbox>
                  {/* <Link className="text-sm text-gray-500 font-medium">
                    Forgot Password?
                  </Link> */}
                </div>
                {/* Login Form Submit button */}
                <Button isLoading={loading} type="submit" className="bg-gray-900 text-white shadow-lg">Sign in</Button>
              </form> 
              {/* Register link */}
              <div className="flex flex-col items-center justify-center space-y-2 my-6">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-[12px]">Dont have an account?</p> 
                  <Link href="/register" className="font-medium" color="foreground">Register now!</Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Login;

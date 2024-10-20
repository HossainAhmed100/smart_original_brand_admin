"use client"
import { Button, Card, CardBody, Checkbox, Input, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { auth } from "@/firebase/firebase.config";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


const Register = () => {
  useEffect(() => {
    document.title = 'Register now | Zero Exclusive Online Shop';
  }, []);

  const { login } = useAuth();
  // State to manage the visibility of the password input
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter()
  // Hook to create a user with email and password using Firebase Authentication
  const [createUserWithEmailAndPassword, loading] = useCreateUserWithEmailAndPassword(auth);

  // Custom hook to get an instance of Axios for making HTTP requests
  const axiosPublic = useAxiosPublic();

  // Function to toggle password visibility
  const toggleVisibility = () => setIsVisible(!isVisible);

  // Form management using react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Function to handle form submission
  const onSubmit = async (data) => {
    // Log the form data for debugging purposes
    // Prepare the user data to be sent to the backend
    const userData = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      role: "admin",
    };

    try {
      // Create a user with Firebase Authentication
      const result = await createUserWithEmailAndPassword(data.email, data.password);

      if(result){
        
      try{
        // Make API call to register user using axios
        const response = await axiosPublic.post('/roleauth/roleregister', userData);

        // Extract token from response
        const token = response.data.token;

        // Store token in localStorage
        login(token)

         // Show a success message upon successful registration and data saving
        Swal.fire({
          icon: "success",
          title: "Account Successfully Created!",
        });

        // Redirect the user to another page (specified by the 'from' variable)
        router.push("/")
      }
      catch (axiosError) {
        // Log any errors that occur during the Axios request
        console.error('Axios error:', axiosError);

        // Show an error message if there is an issue with the backend request
        Swal.fire({
          icon: "error",
          title: "Backend Error",
          text: axiosError.message,
        });
      }
    }
    } catch (error) {
       // Log any errors that occur during the Firebase Authentication process
      console.error('Registration Error:', error);

      // Show an error message if there is an issue with user registration
      Swal.fire({
        icon: "error",
        title: "Registration Error",
        text: error.message || 'Something went wrong!',
      });
    }
  };
  
  return (
    <section className="bg-gray-50">
      <div className="flex items-center justify-center min-h-screen">
        <div>
          <Card className="w-[350px] shadow p-4">
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-full flex-col mb-6 md:mb-0 gap-4">
                <div>
                  <h3 className="font-bold text-center text-2xl">SIGN UP</h3>
                </div>
                {/* Input field for Full Name */}
                <Input 
                  radius="sm" 
                  size={"md"}
                  type="text" 
                  name="fullName"
                  label="Full Name" 
                  className="w-full"
                  variant="bordered" 
                  labelPlacement="outside" 
                  placeholder="Type your Full Name" 
                  {...register("fullName", { required: "Please enter your Name"})}
                  color={errors.fullName ? "danger" : "default"}
                />
                {/* Error message for Full Name validation */}
                {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
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
                  name="password"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Enter your password"
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (<HiEyeOff />) : (<HiEye />)}
                    </button>
                  }
                  className="w-full"
                  type={isVisible ? "text" : "password"}
                  {...register("password", { required: "Please enter a password", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                  color={errors.password ? "danger" : "default"}
                />
                {/* Error message for Password validation */}
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                {/* Submit button */}
                <Button isLoading={loading} type="submit"  className="bg-gray-900 text-white shadow-lg">Register now</Button>
              </form> 
              {/* Login link */}
              <div className="flex flex-col items-center justify-center space-y-2 my-6">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-[12px]">Already have an account?</p> 
                  <Link href="/login" className="font-medium" color="foreground">Login now!</Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Register;

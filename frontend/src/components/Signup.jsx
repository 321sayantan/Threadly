import React, {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { toast } from "sonner";
import {register} from "@/http/api";
import { Loader2 } from 'lucide-react';
// import clsx from "clsx";


const signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setcPassword] = useState("");
    const [textboxType, setTextboxType] = useState("");
    const [togglePass, setTogglePass] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
      setTogglePass(!togglePass);
      setTextboxType(togglePass ? "text" : "password");
    };

    const handelSubmit = async (e) => {
      e.preventDefault();
      if(username === "" || email === "" || password === "" || cpassword === "") {
        toast.error("Please fill all the fields");
        return;
      }
      
      if (password !== cpassword) {
        toast.error("Password do not match");
        return;
      }
      setLoading(true);
      
      const data = {
        username: username,
        email: email,
        password: password,
      };

      const res = await register(data);

      setLoading(false);

      if (res.success === false) {
        toast.error(res.message);
        return;
      }
      else{
        toast.success(res.message);
        navigate("/login");
      }
      setEmail("");
      setPassword("");
      setcPassword("");
    };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="w-[350px] shadow-2xl">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>Signup to connect with your friends</CardDescription>
        </CardHeader>
        <form onSubmit={handelSubmit} className="space-y-4">
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
                <Input
                  id="password"
                  type={textboxType}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <h1>sdfsdf</h1> */}
                <div className="flex justify-end mt-[-30px] mr-2.5 mb-1.5">
                  <span>
                    {togglePass ? (
                      <FaRegEye onClick={togglePassword} />
                    ) : (
                      <FaRegEyeSlash onClick={togglePassword} />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Confirm Password</Label>
                <Input
                  // className={"border-red-500"}
                  id="cpassword"
                  type={textboxType}
                  placeholder="Enter your Confirm password"
                  onChange={(e) => setcPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            {loading ? (
              <Button className="w-full mt-3.5" disabled={loading}>
                <Loader2 className="animate-spin mr-2" size={14} />
                Please Wait...
              </Button>
            ) : (
              <Button type="submit" className="w-full mt-3.5">
                Signup
              </Button>
            )}
          </CardFooter>
        </form>
        <span className="text-center text-sm" disabled={loading}>
          Already have an Account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>{" "}
        </span>
      </Card>
    </div>
  );
}

export default signup
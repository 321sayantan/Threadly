import React, { use, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { login } from "@/http/api";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import useUserStore from "@/lib/store";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [textboxType, setTextboxType] = useState("Password");
  const [togglePass, setTogglePass] = useState(true);
  const navigate = useNavigate();

  const {user, setUser} = useUserStore();

  const togglePassword = () => {
    setTogglePass(!togglePass);
    setTextboxType(togglePass ? "text" : "password");
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if(email === "" || password === "") {
            toast.error("Please fill all the fields");
            return;
      }

    setLoading(true);
    const data = {
      email: email,
      password: password
    }

    const res = await login(data)

    if (res.success === false) {
      toast.error(res.message);
    }
    else{
      toast.success(res.message);
      setUser(res.userdata);
      // console.log(user)
      navigate("/");
    }
    setLoading(false);
    setPassword("");
  };
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="w-[350px] shadow-2xl">
        <CardHeader>
          <CardTitle>LOGIN</CardTitle>
          <CardDescription>Login to connect with your friends</CardDescription>
        </CardHeader>
        <form onSubmit={handelSubmit} className="space-y-4">
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your Email"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  type={textboxType}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            {
              loading ? (
                <Button className="w-full mt-3.5" disabled={loading}>
                  <Loader2 className="animate-spin mr-2" size={14} />
                  Please Wait...
                </Button>
              ) : (
                <Button type="submit" className="w-full mt-3.5">
                  Login
                </Button>
              )
            }
          </CardFooter>
        </form>
        <span className="text-center text-sm">
          Don't have an Account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>{" "}
        </span>
      </Card>
    </div>
  );
}

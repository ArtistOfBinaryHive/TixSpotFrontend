"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {login} from "@/components/api-calls/auth";
import getUserDetails from "@/components/api-calls/user-details"
import GoogleLogin from "../google";
interface SigninFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email address.",
  }),
  // TODO: add password validation and errors
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export function SigninForm({ className, ...props }: SigninFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    

    const call=async (values: z.infer<typeof formSchema>) => {
      const loginresponse= await login(values.email,values.password)
      console.log(loginresponse)
      if (loginresponse['access_token']) {
        localStorage.setItem('access_token', loginresponse['access_token']);
        const userDetails=await getUserDetails(loginresponse['access_token'])
        console.log(userDetails)
        // add userDetails to redux
      }
      
    }
    call(values)

    console.log(values);
  }
  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Username</FormLabel> */}
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Username</FormLabel> */}
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="w-full mt-10">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      {/* TODO: add apple and google icon */}
      <div className="w-full space-y-4">
        <div>
          <Button
            variant="secondary"
            type="button"
            disabled={isLoading}
            className="w-full "
            // onClick={() => GoogleLogin()}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
             
            )}
            
            
          </Button>
          <GoogleLogin/>
        </div>
        <div>
          <Button
            variant="secondary"
            type="button"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
            )}
            Sign in with Apple ID
          </Button>
        </div>
      </div>
    </div>
  );
}

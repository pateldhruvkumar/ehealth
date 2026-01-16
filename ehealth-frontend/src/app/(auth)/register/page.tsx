import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { Stethoscope, User } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Choose your role to get started
        </p>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-2">
        <Link href={ROUTES.REGISTER_PATIENT} className="group">
          <Card className="h-full transition-all hover:border-blue-500 hover:shadow-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-600 group-hover:text-white">
                <User className="h-6 w-6" />
              </div>
              <CardTitle>I'm a Patient</CardTitle>
              <CardDescription>
                Store and share your medical records securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" variant="outline">
                Register as Patient
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href={ROUTES.REGISTER_DOCTOR} className="group">
          <Card className="h-full transition-all hover:border-green-500 hover:shadow-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-600 group-hover:text-white">
                <Stethoscope className="h-6 w-6" />
              </div>
              <CardTitle>I'm a Doctor</CardTitle>
              <CardDescription>
                View patient records and manage consultations.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" variant="outline">
                Register as Doctor
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

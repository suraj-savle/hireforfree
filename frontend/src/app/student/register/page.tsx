import RegisterForm from "@/components/RegisterForm";

export default function StudentRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <RegisterForm role="STUDENT" />
    </div>
  );
}
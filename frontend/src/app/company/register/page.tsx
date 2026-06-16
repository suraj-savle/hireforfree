import RegisterForm from "@/components/RegisterForm";

export default function CompanyRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <RegisterForm role="COMPANY" />
    </div>
  );
}
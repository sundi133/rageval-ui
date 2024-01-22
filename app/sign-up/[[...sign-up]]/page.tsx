import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="container flex justify-center items-center mt-16">
      <SignUp afterSignUpUrl={'/add/dataset'} afterSignInUrl={'/add/dataset'} />
    </div>
  );
}

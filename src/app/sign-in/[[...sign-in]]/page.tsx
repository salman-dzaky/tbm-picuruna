import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary px-4">
      <SignIn
        routing="path"
        path="/sign-in"
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            cardBox: 'shadow-lg rounded-xl',
          },
        }}
      />
    </div>
  );
}

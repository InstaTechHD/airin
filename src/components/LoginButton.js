import { signIn } from "next-auth/react";

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      await signIn("anilist", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Login with AniList
    </button>
  );
};

export default LoginButton;

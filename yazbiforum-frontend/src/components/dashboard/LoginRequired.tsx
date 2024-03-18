import Button from "../ui/Button";

const LoginRequired: React.FC = () => {
  return (
    <div className="w-1/2 m-auto pt-60">
      <h3 className="w-full text-4xl text-center mb-5">
        Ooppps <span className="text-[#D63484]">!!</span>
      </h3>
      <p className="text-xl text-center">Dashboardınıza erişebilmek için öncelikle giriş yapmanız gerekli.</p>
      <div className="w-full text-center mt-5">
        <Button onClick={() => (window.location.href = "/signin")}>Giriş Sayfası</Button>
      </div>
    </div>
  );
};

export default LoginRequired;

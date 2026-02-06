import logo from "../assets/logo.png";

export const BrandLogo = ({
  className = "h-14 w-auto",
}: {
  className?: string;
}) => {
  return (
    <img
      src={logo}
      alt="Carelink Logo"
      className={className}
      draggable={false}
    />
  );
};

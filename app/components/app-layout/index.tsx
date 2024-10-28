import { Footer } from "./Footer";
import { Header } from "./Header";

export const AppLayout = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

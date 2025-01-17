import { Button, Link } from "@nextui-org/react";
import { AiFillHome } from "react-icons/ai";
export const metadata = {
  title: '404 Page Not Found',
  description: 'Smart Original Brand Online Shop',
}

const NotFoundPage = () => {
  return (
    <>
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Something missing.</p>
          <p className="mb-4 text-lg font-light text-gray-500">Sorry, we cant find that page. You will find lots to explore on the home page. </p>
          <Button startContent={<AiFillHome size={20}/>} as={Link} href="/" color="primary" variant="solid" radius="sm">Back to Homepage</Button>
        </div>   
      </div>
    </section>
    </>
  );
};

export default NotFoundPage;

import { Nav } from "@/components/Nav";
import { Toast } from "@/components/Toast";
import { ProductView } from "@/components/ProductView";
import { BagDrawer } from "@/components/BagDrawer";
import { Heat } from "@/components/sections/Heat";
import { Story } from "@/components/sections/Story";
import { Street } from "@/components/sections/Street";
import { Legit } from "@/components/sections/Legit";
import { NextDrop } from "@/components/sections/NextDrop";
import { Shop } from "@/components/sections/Shop";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <Toast />
      <ProductView />
      <BagDrawer />
      <main>
        <Heat />
        <Story />
        <Street />
        <Legit />
        <NextDrop />
        <Shop />
      </main>
      <Footer />
    </>
  );
}

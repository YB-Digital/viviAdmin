import type { Metadata } from "next";
import LayoutComponent from "@/component/layoutComponent";
import Header from "@/component/header";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

//style
import '@/style/globals.scss'
import './adminLayout.scss'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Header />
            <div className="adminLayout">
                <LayoutComponent />
                {children}
            </div>
        </div>
    );
}
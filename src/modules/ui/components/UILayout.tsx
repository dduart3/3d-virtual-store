import { ReactNode } from "react";
import { CartButton } from "../../cart/components/CartButton";
import { Chat } from "../../chat/components/Chat";
import { CartPanel } from "../../cart/components/CartPanel";
import { UserMenu } from "../../auth/components/UserMenu";

interface UILayoutProps {
  children?: ReactNode;
}

export const UILayout = ({ children }: UILayoutProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top right - Cart and Account */}
      <div className="absolute top-3 right-5 flex items-center gap-4 pointer-events-auto">
        <CartButton />
        <button className="bg-white/10 p-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>

      <Chat />
      <CartPanel />
      <UserMenu />
      {children}
    </div>
  );
};

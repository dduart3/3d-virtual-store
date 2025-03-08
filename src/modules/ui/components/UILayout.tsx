import { ReactNode } from "react";
import { CartButton } from "../../cart/components/CartButton";
import { Chat } from "../../chat/components/Chat";
import { CartPanel } from "../../cart/components/CartPanel";
import { UserMenuButton } from "./UserMenuButton";

interface UILayoutProps {
  children?: ReactNode;
}

export const UILayout = ({ children }: UILayoutProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top right - Cart and Account */}
      <div className="absolute top-3 right-5 flex items-center gap-4 pointer-events-auto">
        <CartButton />
        <UserMenuButton />
      </div>

      <Chat />
      <CartPanel />
      {children}
    </div>
  );
};

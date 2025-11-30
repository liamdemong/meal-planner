import { HeaderSimple } from "../components/Header";
import { PATHS } from "../constants/Navigation";
import { Outlet } from "react-router-dom";

const RootLayout = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      width: "100%",
    }}
  >
    <HeaderSimple links={PATHS} />
    <main
      style={{
        flex: 1,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Outlet />
    </main>
  </div>
);

export default RootLayout;

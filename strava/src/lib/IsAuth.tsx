// isAuth.tsx

"use client";
import { useSelector} from "react-redux";
import type { RootState } from "./store";
import { useEffect } from "react";
import { redirect } from "next/navigation";


export default function isAuth(Component: any) {
 
  return function IsAuth(props: any) {
    const auth = useSelector((state: RootState) => state.authorisation.auth);


    useEffect(() => {
      if (!auth) {
        return redirect("/");
      }
    }, [auth]);


    if (!auth) {
      return null;
    }

    return <Component {...props} />;
  };
}
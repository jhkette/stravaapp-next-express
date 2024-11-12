import Image from "next/image";
import { useGetUserQuery } from "@/lib/activitySlice";

export default function Header() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  return (
    <div className="flex flex-col items-end">
      {isSuccess && (
        <div className="w-48 bg-gray-100 rounded-sm mt-4 p-4 flex flex-col justify-end items-end">
          <Image
            src={result1?.profile?.profile}
            alt=""
            width="80"
            height="80"
            style={{ width: "40px", height: "40px" }} // optional
          />

          <p> {isSuccess && `Logged in as ${result1.profile?.firstname}`}</p>
        </div>
      )}
    </div>
  );
}

import JuiceApp from "@/components/JuiceApp";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      style={{ scrollbarGutter: "stable" }}
    >
      <JuiceApp />
      <Toaster position="top-right" />
    </div>
  );
}

import { useFormStatus } from "react-dom";

const RePostButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="p-2 w-full disabled:cursor-not-allowed   hover:bg-gray-100 cursor-pointer"
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
          re-posting
        </div>
      ) : (
        "Re-post"
      )}
    </button>
  );
};

export default RePostButton;

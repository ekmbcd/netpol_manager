type DeleteElementButtonProps = {
  onClick: () => void;
};

function DeleteElementButton({ onClick }: DeleteElementButtonProps) {
  return (
    <button
      className="grid place-content-center w-6 h-6 mr-2 text-red-100 
       text-lg transition-colors duration-150 bg-red-500 rounded-full focus:shadow-outline hover:bg-red-600 shrink-0"
      type="button"
      onClick={onClick}
    >
      <p className="pb-0.5">-</p>
    </button>
  );
}

export default DeleteElementButton;
